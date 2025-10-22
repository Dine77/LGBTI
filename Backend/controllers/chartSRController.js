import mongoose from "mongoose";

export const getSRChartData = async (req, res) => {
    try {
        let { section } = req.query;
        if (!section) return res.status(400).json({ message: "Missing section" });

        section = section.trim(); // remove leading/trailing spaces

        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");
        const labelCol = db.collection("val_labels");
        const mapCol = db.collection("dashboard_map");

        // ✅ Case-insensitive exact match for section + SR type only
        const srQuestions = await mapCol
            .find({
                section: { $regex: `^${section}$`, $options: "i" }, // case-insensitive exact match
                question_type: "SR",
            })
            .toArray();

        if (!srQuestions.length) {
            console.warn(`⚠️ No SR questions found for section: ${section}`);
            return res.json([]);
        }

        const results = [];

        for (const q of srQuestions) {
            const fieldPath = `data.${q.study_var}`;

            // ✅ Filter for completed surveys only
            const filter = { "data.phase1_status": "Completed" };

            // ✅ Get distinct response values for this variable
            const values = await surveyCol.distinct(fieldPath, filter);
            if (!values.length) continue;

            // ✅ Map value → label
            const labels = await labelCol.find({ Variable: q.study_var }).toArray();
            const labelMap = {};
            labels.forEach((lbl) => {
                labelMap[String(lbl.Value)] = lbl.Label;
            });

            // ✅ Count each value occurrence
            const counts = {};
            const cursor = surveyCol.find(filter, { projection: { [fieldPath]: 1 } });
            for await (const doc of cursor) {
                const val = doc?.data?.[q.study_var];
                if (val !== null && val !== undefined && val !== "") {
                    counts[val] = (counts[val] || 0) + 1;
                }
            }

            // ✅ Calculate percentage and map to label
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            const data = Object.entries(counts).map(([val, count]) => ({
                name: labelMap[val] || val,
                value: Number(((count / total) * 100).toFixed(1)), // % rounded to 1 decimal
            }));

            results.push({
                group_name: q.group_name,
                study_var: q.study_var,
                question_text: q.question_text,
                charttype: q.charttype,
                section: q.section,
                data,
            });
        }
        res.json(results);
    } catch (err) {
        console.error("❌ getSRChartData error:", err);
        res.status(500).json({ message: "Error fetching SR chart data" });
    }
};
