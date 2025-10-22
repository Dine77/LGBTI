import mongoose from "mongoose";

export const getMRChartData = async (req, res) => {
    try {
        const { section } = req.query;
        if (!section) return res.status(400).json({ message: "Missing section" });

        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");
        const labelCol = db.collection("val_labels");
        const mapCol = db.collection("dashboard_map");

        // 🔹 Get all MR questions for that section
        const mrQuestions = await mapCol
            .find({
                section: { $regex: `^${section}$`, $options: "i" },
                question_type: "MR",
            })
            .sort({ sort_order: 1 })
            .toArray();

        if (!mrQuestions.length) {
            return res.json([]);
        }

        // 🔹 Group by group_name (e.g., C8, D17, etc.)
        const grouped = {};
        mrQuestions.forEach((q) => {
            if (!grouped[q.group_name]) grouped[q.group_name] = [];
            grouped[q.group_name].push(q);
        });

        const results = [];

        // 🔹 For each group (one chart)
        for (const [groupName, vars] of Object.entries(grouped)) {
            const counts = {};

            for (const q of vars) {
                const fieldPath = `data.${q.study_var}`;
                const filter = {
                    "data.phase1_status": "Completed",
                    [fieldPath]: { $in: [1, "1", true] }, // only count 'checked' options
                };
                const count = await surveyCol.countDocuments(filter);
                counts[q.multi_lable || q.study_var] = count;
            }

            const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
            const data = Object.entries(counts).map(([label, count]) => ({
                name: label,
                value: ((count / total) * 100).toFixed(1),
            }));

            results.push({
                group_name: groupName,
                section,
                question_text: vars[0].question_text,
                charttype: vars[0].charttype,
                data,
            });
        }

        res.json(results);
    } catch (err) {
        console.error("getMRChartData error:", err);
        res.status(500).json({ message: "Error fetching MR chart data" });
    }
};
