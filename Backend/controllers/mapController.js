import mongoose from "mongoose";

export const getMapData = async (req, res) => {
    try {
        const { District, T_Area } = req.query;
        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");
        const labelCol = db.collection("val_labels");

        // 🔍 Only Completed Responses
        const filter = { "data.phase1_status": "Completed" };

        if (District && District !== "All") filter["data.District"] = District;
        if (T_Area && T_Area !== "All") filter["data.T_Area"] = T_Area;

        // 🧩 Fetch only fields we need
        const docs = await surveyCol
            .find(filter, {
                projection: {
                    "data.District": 1,
                    "data.T_Area": 1,
                    "data.location": 1,
                    "data.latitude": 1,
                    "data.longitude": 1,
                },
            })
            .toArray();

        if (!docs.length) {
            return res.json({ count: 0, markers: [] });
        }

        // 1️⃣ Get distinct District and T_Area codes from data
        const allDistrictCodes = [...new Set(docs.map((d) => d.data?.District))].filter(Boolean);
        const allAreaCodes = [...new Set(docs.map((d) => d.data?.T_Area))].filter(Boolean);

        // 2️⃣ Fetch labels from val_labels collection for both variables
        const labels = await labelCol
            .find({
                Variable: { $in: ["District", "T_Area"] },
                Value: { $in: [...allDistrictCodes, ...allAreaCodes].map((v) => Number(v)) },
            })
            .toArray();

        // 3️⃣ Create mapping of value → label
        const labelMap = {};
        labels.forEach((lbl) => {
            labelMap[`${lbl.Variable}_${lbl.Value}`] = lbl.Label;
        });

        // 4️⃣ Process markers
        const markers = [];

        for (const doc of docs) {
            const d = doc.data || {};
            let lat = null;
            let lng = null;

            // ✅ Case 1: Has location string "lat,lng"
            if (d.location && typeof d.location === "string") {
                const parts = d.location.split(",").map((v) => parseFloat(v.trim()));
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    lat = parts[0];
                    lng = parts[1];
                }
            }

            // ✅ Case 2: Has separate latitude & longitude fields
            if (
                (d.latitude && d.longitude) &&
                !isNaN(parseFloat(d.latitude)) &&
                !isNaN(parseFloat(d.longitude))
            ) {
                lat = parseFloat(d.latitude);
                lng = parseFloat(d.longitude);
            }

            // ✅ Lookup readable labels
            const districtLabel = labelMap[`District_${d.District}`] || d.District || "";
            const areaLabel = labelMap[`T_Area_${d.T_Area}`] || d.T_Area || "";

            // ✅ Add marker only if coordinates valid
            if (lat !== null && lng !== null) {
                markers.push({
                    lat,
                    lng,
                    title: `${districtLabel}${areaLabel ? " - " + areaLabel : ""}`,
                });
            }
        }

        // ✅ Final Response
        res.json({
            count: markers.length,
            markers,
        });
    } catch (err) {
        console.error("Error in getMapData:", err);
        res.status(500).json({ message: "Error fetching map data" });
    }
};
