import mongoose from "mongoose";

export const getSRChartData = async (req, res) => {
    try {
        let { section, District, T_Area, Category, B1_PostCode } = req.query;
        if (!section) return res.status(400).json({ message: "Missing section" });

        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");
        const labelCol = db.collection("val_labels");
        const mapCol = db.collection("dashboard_map");

        // ✅ Sort by section_sort then sort_order
        const srQuestions = await mapCol
            .find({
                section: { $regex: `^${section}$`, $options: "i" },
                question_type: "SR",
            })
            .sort({ section_sort: 1, sort_order: 1 })
            .toArray();

        if (!srQuestions.length) {
            console.warn(`⚠️ No SR questions found for section: ${section}`);
            return res.json({ overall_base: 0, charts: [] });
        }

        // 🔹 Filters
        const filter = { "data.phase1_status": "Completed" };
        if (District && District !== "All") filter["data.District"] = District;
        if (T_Area && T_Area !== "All") filter["data.T_Area"] = T_Area;
        if (Category && Category !== "All") filter["data.Category"] = Category;
        if (B1_PostCode && B1_PostCode !== "All") filter["data.B1_PostCode"] = B1_PostCode;

        const overall_base = await surveyCol.countDocuments(filter);
        const charts = [];

        // ✅ Keep processing order from DB
        for (const q of srQuestions) {
            const fieldPath = `data.${q.study_var}`;
            const values = await surveyCol.distinct(fieldPath, filter);
            if (!values.length) continue;

            const labels = await labelCol.find({ Variable: q.study_var }).toArray();
            const labelMap = {};
            labels.forEach((lbl) => (labelMap[String(lbl.Value)] = lbl.Label));

            const counts = {};
            const cursor = surveyCol.find(filter, { projection: { [fieldPath]: 1 } });
            for await (const doc of cursor) {
                const val = doc?.data?.[q.study_var];
                if (val !== null && val !== undefined && val !== "") {
                    counts[val] = (counts[val] || 0) + 1;
                }
            }

            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            const data = Object.entries(counts).map(([val, count]) => ({
                name: labelMap[val] || val,
                value: Number(((count / total) * 100).toFixed(1)),
            }));

            charts.push({
                group_name: q.group_name,
                study_var: q.study_var,
                question_text: q.question_text,
                charttype: q.charttype,
                section: q.section,
                sort_order: q.sort_order,
                section_sort: q.section_sort,
                data,
            });
        }

        // ✅ Final sort safety
        charts.sort((a, b) => a.sort_order - b.sort_order);

        res.json({ overall_base, charts });
    } catch (err) {
        console.error("❌ getSRChartData error:", err);
        res.status(500).json({ message: "Error fetching SR chart data" });
    }
};
