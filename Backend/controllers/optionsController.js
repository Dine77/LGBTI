import mongoose from "mongoose";

export const getOptions = async (req, res) => {
    try {
        const { col, District, T_Area } = req.query;
        if (!col) return res.status(400).json({ message: "Missing column" });

        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");
        const labelCol = db.collection("val_labels");

        // 🧩 Field mapping
        const colMap = {
            District: "data.District",
            T_Area: "data.T_Area",
        };
        const path = colMap[col] || col;

        // 🧠 Dynamic filter (only completed data)
        const filter = { "data.phase1_status": "Completed" };

        if (District && District !== "All") filter["data.District"] = District;
        if (T_Area && T_Area !== "All") filter["data.T_Area"] = T_Area;

        // 1️⃣ Get distinct values for the requested column (only from completed data)
        const values = await surveyCol.distinct(path, filter);

        if (!values.length) {
            return res.json([{ value: "All", label: "All" }]);
        }

        // 2️⃣ Fetch labels from val_labels collection
        const labels = await labelCol.find({ Variable: col }).toArray();

        // 3️⃣ Map value → label
        const labelMap = {};
        labels.forEach((lbl) => {
            labelMap[String(lbl.Value)] = lbl.Label;
        });

        // 4️⃣ Build final options list
        const final = [
            ...values
                .filter((v) => v !== null && v !== undefined)
                .map((v) => ({
                    value: String(v),
                    label: labelMap[String(v)] || String(v),
                })),
        ];

        res.json(final);
    } catch (err) {
        console.error("getOptions error:", err);
        res.status(500).json({ message: "Error fetching options" });
    }
};
