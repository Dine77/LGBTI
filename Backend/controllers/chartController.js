// controllers/chartController.js
import mongoose from "mongoose";

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


// controllers/chartController.js (continued)
export const getChartData = async (req, res) => {
    try {
        const { group } = req.query;
        if (!group) return res.status(400).json({ message: "Missing group_name" });

        const db = mongoose.connection.db;
        const metaCol = db.collection("question_meta");
        const dataCol = db.collection("surveyresponses");

        const questions = await metaCol.find({ group_name: group }).toArray();
        if (!questions.length) return res.json([]);

        const questionType = questions[0].question_type; // SR or MR
        const chartType = questions[0].charttype || "Bar";
        const questionText = questions[0].question_text;

        let labels = [];
        let values = [];

        if (questionType === "SR") {
            const studyVar = questions[0].study_var;
            const pipeline = [
                { $match: { "data.phase1_status": "Completed" } },
                {
                    $group: {
                        _id: `$data.${studyVar}`,
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ];

            const agg = await dataCol.aggregate(pipeline).toArray();
            const total = agg.reduce((a, b) => a + b.count, 0);
            labels = agg.map((x) => x._id);
            values = agg.map((x) => ((x.count / total) * 100).toFixed(1));
        } else if (questionType === "MR") {
            const multiVars = questions.map((q) => ({
                key: q.study_var,
                label: q.multi_lable,
            }));

            const counts = [];
            for (const { key, label } of multiVars) {
                const count = await dataCol.countDocuments({
                    [`data.${key}`]: 1,
                    "data.phase1_status": "Completed",
                });
                counts.push({ label, count });
            }

            const total = counts.reduce((a, b) => a + b.count, 0);
            labels = counts.map((x) => x.label);
            values = counts.map((x) =>
                ((x.count / total) * 100).toFixed(1)
            );
        }

        res.json({
            question_text: questionText,
            chart_type: chartType,
            labels,
            values,
        });
    } catch (err) {
        console.error("getChartData error:", err);
        res.status(500).json({ message: "Error fetching chart data" });
    }
};
