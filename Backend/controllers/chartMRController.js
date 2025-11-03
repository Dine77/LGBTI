import mongoose from "mongoose";

export const getMRChartData = async (req, res) => {
    try {
        const { section } = req.query;
        if (!section) return res.status(400).json({ message: "Missing section" });

        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");
        const mapCol = db.collection("dashboard_map");

        // ✅ Fetch and sort MR questions properly
        const mrQuestions = await mapCol
            .find({
                section: { $regex: `^${section}$`, $options: "i" },
                question_type: "MR",
            })
            .sort({ section_sort: 1, sort_order: 1 })
            .toArray();

        if (!mrQuestions.length) {
            return res.json({ overall_base: 0, charts: [] });
        }

        // ✅ Group questions by group_name
        const grouped = {};
        mrQuestions.forEach((q) => {
            if (!grouped[q.group_name]) grouped[q.group_name] = [];
            grouped[q.group_name].push(q);
        });

        const charts = [];
        const overall_base = await surveyCol.countDocuments({
            "data.phase1_status": "Completed",
        });

        // ✅ Process each group as one chart
        for (const [groupName, questions] of Object.entries(grouped)) {
            const counts = {};

            for (const q of questions) {
                const fieldPath = `data.${q.study_var}`;
                const filter = {
                    "data.phase1_status": "Completed",
                    [fieldPath]: { $in: [1, "1", true] },
                };

                const count = await surveyCol.countDocuments(filter);
                counts[q.multi_lable || q.study_var] = count;
            }

            const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

            // ✅ Create one chart with multiple bars (options)
            const data = Object.entries(counts).map(([label, count]) => ({
                name: label,
                value: Number(((count / total) * 100).toFixed(1)),
            }));

            const baseInfo = questions[0]; // pick the first for meta info

            charts.push({
                group_name: groupName,
                section,
                question_text: baseInfo.question_text,
                charttype: baseInfo.charttype,
                sort_order: baseInfo.sort_order,
                section_sort: baseInfo.section_sort,
                data,
            });
        }

        // ✅ Sort charts according to sort_order
        charts.sort((a, b) => a.sort_order - b.sort_order);

        res.json({ overall_base, charts });
    } catch (err) {
        console.error("getMRChartData error:", err);
        res.status(500).json({ message: "Error fetching MR chart data" });
    }
};
