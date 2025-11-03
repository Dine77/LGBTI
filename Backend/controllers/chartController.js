// controllers/chartController.js
import mongoose from "mongoose";

// ✅ 1️⃣ Get all questions (keep this part same)
export const getAllQuestions = async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const metaCol = db.collection("dashboard_map");

        const questions = await metaCol
            .find({}, { projection: { _id: 0 } })
            .sort({ section_sort: 1, sort_order: 1 })
            .toArray();

        res.json(questions);
    } catch (err) {
        console.error("getAllQuestions error:", err);
        res.status(500).json({ message: "Error fetching questions" });
    }
};

// ✅ 2️⃣ Get all charts for a section (combined SR + MR)
export const getChartData = async (req, res) => {
    try {
        const { section } = req.query;
        if (!section) return res.status(400).json({ message: "Missing section" });

        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");
        const labelCol = db.collection("val_labels");
        const mapCol = db.collection("dashboard_map");

        // 🧩 Fetch both SR + MR for the section, sorted correctly
        const allQuestions = await mapCol
            .find({
                section: { $regex: `^${section}$`, $options: "i" },
                question_type: { $in: ["SR", "MR"] },
            })
            .sort({ section_sort: 1, sort_order: 1 })
            .toArray();

        if (!allQuestions.length)
            return res.json({ overall_base: 0, charts: [] });

        const overall_base = await surveyCol.countDocuments({
            "data.phase1_status": "Completed",
        });

        const charts = [];

        // ✅ Separate SR and MR for processing
        const srQuestions = allQuestions.filter((q) => q.question_type === "SR");
        const mrQuestions = allQuestions.filter((q) => q.question_type === "MR");

        // ✅ Process SR Questions
        for (const q of srQuestions) {
            const fieldPath = `data.${q.study_var}`;
            const values = await surveyCol.distinct(fieldPath, {
                "data.phase1_status": "Completed",
            });
            if (!values.length) continue;

            const labels = await labelCol.find({ Variable: q.study_var }).toArray();
            const labelMap = {};
            labels.forEach((lbl) => (labelMap[String(lbl.Value)] = lbl.Label));

            const counts = {};
            const cursor = surveyCol.find(
                { "data.phase1_status": "Completed" },
                { projection: { [fieldPath]: 1 } }
            );

            for await (const doc of cursor) {
                const val = doc?.data?.[q.study_var];
                if (val !== null && val !== undefined && val !== "")
                    counts[val] = (counts[val] || 0) + 1;
            }

            const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
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
                question_type: q.question_type,
                sort_order: q.sort_order,
                data,
            });
        }

        // ✅ Process MR Questions (grouped by group_name)
        const groupedMR = {};
        mrQuestions.forEach((q) => {
            if (!groupedMR[q.group_name]) groupedMR[q.group_name] = [];
            groupedMR[q.group_name].push(q);
        });

        for (const [groupName, questions] of Object.entries(groupedMR)) {
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
            const data = Object.entries(counts).map(([label, count]) => ({
                name: label,
                value: Number(((count / total) * 100).toFixed(1)),
            }));

            const baseInfo = questions[0];

            charts.push({
                group_name: groupName,
                study_var: baseInfo.study_var,
                question_text: baseInfo.question_text,
                charttype: baseInfo.charttype,
                section: baseInfo.section,
                question_type: "MR",
                sort_order: baseInfo.sort_order,
                data,
            });
        }

        // ✅ Combine SR + MR in one order
        charts.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        res.json({ overall_base, charts });
    } catch (err) {
        console.error("getChartData error:", err);
        res.status(500).json({ message: "Error fetching chart data" });
    }
};
