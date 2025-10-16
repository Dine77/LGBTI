import mongoose from "mongoose";

export const getSurveyData = async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");

        const { region, age, gender, subgroup } = req.query;
        const filter = { "data.phase1_status": "Completed" };

        if (region && region !== "All") filter["data.zone"] = region;
        if (age && age !== "All") filter["data.BI_postcodde"] = age;
        if (gender && gender !== "All") filter["data.B4"] = gender;
        if (subgroup && subgroup !== "All") filter["data.B3"] = subgroup;

        const pipeline = [
            { $match: filter },

            // 🧩 Map codes to categories
            {
                $addFields: {
                    Variable: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$data.B3", "1"] }, then: "Lesbian" },
                                { case: { $eq: ["$data.B3", "2"] }, then: "Gay" },
                                { case: { $eq: ["$data.B3", "3"] }, then: "Bisexual" },
                                { case: { $eq: ["$data.B3", "4"] }, then: "Transgender" },
                                { case: { $eq: ["$data.B3", "5"] }, then: "Intersex" },
                                { case: { $in: ["$data.T_Area", ["2", "3"]] }, then: "Rural/Semi-urban" },
                                { case: { $eq: ["$data.T_Area", "1"] }, then: "Urban" },
                            ],
                            default: "Other",
                        },
                    },
                },
            },

            // 🧮 Count by zone, city, variable
            {
                $group: {
                    _id: {
                        Zone: "$data.zone",
                        City: "$data.District",
                        Variable: "$Variable",
                    },
                    Count: { $sum: 1 },
                },
            },

            {
                $project: {
                    _id: 0,
                    Zone: "$_id.Zone",
                    City: "$_id.City",
                    Variable: "$_id.Variable",
                    Count: 1,
                },
            },

            // 🔗 Lookup zone labels
            {
                $lookup: {
                    from: "val_labels",
                    let: { zcode: { $toDouble: "$Zone" } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$Variable", "zone"] },
                                        { $eq: ["$Value", "$$zcode"] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "zoneLabel",
                },
            },

            // 🔗 Lookup city labels
            {
                $lookup: {
                    from: "val_labels",
                    let: { ccode: { $toDouble: "$City" } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$Variable", "District"] },
                                        { $eq: ["$Value", "$$ccode"] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "cityLabel",
                },
            },

            // 🧠 Replace codes with label text
            {
                $addFields: {
                    Zone: {
                        $ifNull: [{ $arrayElemAt: ["$zoneLabel.Label", 0] }, "$Zone"],
                    },
                    City: {
                        $ifNull: [{ $arrayElemAt: ["$cityLabel.Label", 0] }, "$City"],
                    },
                },
            },

            // 🧹 Cleanup
            {
                $project: {
                    zoneLabel: 0,
                    cityLabel: 0,
                },
            },

            { $sort: { Zone: 1, City: 1, Variable: 1 } },
        ];

        const rows = await surveyCol.aggregate(pipeline).toArray();
        res.json({ rows });
    } catch (err) {
        console.error("❌ Error in getSurveyData:", err);
        res.status(500).json({ message: "Error fetching survey data" });
    }
};
