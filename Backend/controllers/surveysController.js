import mongoose from "mongoose";

export const getSurveyData = async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");

        const filter = { "data.phase1_status": "Completed" };

        // if (region && region !== "All") filter["data.zone"] = region;
        // if (age && age !== "All") filter["data.B1_PostCode"] = age;
        // if (gender && gender !== "All") filter["data.B4"] = gender;
        // if (subgroup && subgroup !== "All") filter["data.Category"] = subgroup;

        const pipeline = [
            { $match: filter },

            // 🧩 Derive Subgroup & AreaType fields
            {
                $addFields: {
                    Subgroup: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$data.Category", "1"] }, then: "Lesbian" },
                                { case: { $eq: ["$data.Category", "2"] }, then: "Gay" },
                                { case: { $eq: ["$data.Category", "3"] }, then: "Bisexual" },
                                { case: { $eq: ["$data.Category", "4"] }, then: "Transgender" },
                                { case: { $eq: ["$data.Category", "5"] }, then: "Intersex" },
                            ],
                            default: "Other",
                        },
                    },
                    AreaType: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$data.T_Area", "1"] }, then: "Urban" },
                                { case: { $in: ["$data.T_Area", ["2", "3"]] }, then: "Rural/Semi-urban" },
                            ],
                            default: "Unknown",
                        },
                    },
                },
            },

            // 🧮 Count by Zone + City + Subgroup + AreaType
            {
                $group: {
                    _id: {
                        Zone: "$data.zone",
                        City: "$data.District",
                        Subgroup: "$Subgroup",
                        AreaType: "$AreaType",
                    },
                    Count: { $sum: 1 },
                },
            },

            {
                $project: {
                    _id: 0,
                    Zone: "$_id.Zone",
                    City: "$_id.City",
                    Subgroup: "$_id.Subgroup",
                    AreaType: "$_id.AreaType",
                    Count: 1,
                },
            },

            // 🔗 Lookup zone & city labels
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

            { $project: { zoneLabel: 0, cityLabel: 0 } },

            // ✅ Sort cleanly for frontend grouping
            { $sort: { Zone: 1, City: 1, Subgroup: 1, AreaType: 1 } },
        ];

        const rows = await surveyCol.aggregate(pipeline).toArray();
        console.log("✅ Aggregated rows:", rows);

        res.json({ rows });
    } catch (err) {
        console.error("❌ Error in getSurveyData:", err);
        res.status(500).json({ message: "Error fetching survey data" });
    }
};
