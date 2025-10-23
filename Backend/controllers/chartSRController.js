import mongoose from "mongoose";

export const getSRChartData = async (req, res) => {
    try {
        let { section, District, T_Area, Category, B1_PostCode } = req.query;
        if (!section) return res.status(400).json({ message: "Missing section" });

        section = section.trim();

        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");
        const labelCol = db.collection("val_labels");
        const mapCol = db.collection("dashboard_map");

        // ✅ Match section (case-insensitive) and SR type
        const srQuestions = await mapCol
            .find({
                section: { $regex: `^${section}$`, $options: "i" },
                question_type: "SR",
            })
            .toArray();

        if (!srQuestions.length) {
            console.warn(`⚠️ No SR questions found for section: ${section}`);
            return res.json({ overall_base: 0, charts: [] });
        }

        // 🔹 Dynamic filters
        const filter = { "data.phase1_status": "Completed" };
        if (District && District !== "All") filter["data.District"] = District;
        if (T_Area && T_Area !== "All") filter["data.T_Area"] = T_Area;
        if (Category && Category !== "All") filter["data.Category"] = Category;
        if (B1_PostCode && B1_PostCode !== "All") filter["data.B1_PostCode"] = B1_PostCode;

        // ✅ Compute overall base (respondents count once)
        const overall_base = await surveyCol.countDocuments(filter);

        const charts = [];

        // 🔹 Process each SR question
        for (const q of srQuestions) {
            const fieldPath = `data.${q.study_var}`;

            // ✅ Distinct values for this question
            const values = await surveyCol.distinct(fieldPath, filter);
            if (!values.length) continue;

            // ✅ Label mapping
            const labels = await labelCol.find({ Variable: q.study_var }).toArray();
            const labelMap = {};
            labels.forEach((lbl) => {
                labelMap[String(lbl.Value)] = lbl.Label;
            });

            // ✅ Count responses
            const counts = {};
            const cursor = surveyCol.find(filter, { projection: { [fieldPath]: 1 } });
            for await (const doc of cursor) {
                const val = doc?.data?.[q.study_var];
                if (val !== null && val !== undefined && val !== "") {
                    counts[val] = (counts[val] || 0) + 1;
                }
            }

            // ✅ Compute percentages
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
                data,
            });
        }

        // ✅ Send one base for the section
        res.json({ overall_base, charts });
    } catch (err) {
        console.error("❌ getSRChartData error:", err);
        res.status(500).json({ message: "Error fetching SR chart data" });
    }
};
