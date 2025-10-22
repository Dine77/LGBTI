import mongoose from "mongoose";
export const getdashOptions = async (req, res) => {
    try {
        const { col, District, T_Area, B1_PostCode, Category } = req.query;
        if (!col) return res.status(400).json({ message: "Missing column" });

        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");
        const labelCol = db.collection("val_labels");

        // 🧩 Field mapping
        const colMap = {
            District: "data.District",
            T_Area: "data.T_Area",
            B1_PostCode: "data.B1_PostCode",
            Category: "data.Category",
        };
        const path = colMap[col] || col;

        // 🧠 Build dynamic filter (include only completed data)
        const filter = { "data.phase1_status": "Completed" };

        // 👉 Exclude the column you’re fetching from filters
        if (District && District !== "All" && col !== "District")
            filter["data.District"] = District;
        if (T_Area && T_Area !== "All" && col !== "T_Area")
            filter["data.T_Area"] = T_Area;
        if (B1_PostCode && B1_PostCode !== "All" && col !== "B1_PostCode")
            filter["data.B1_PostCode"] = B1_PostCode;
        if (Category && Category !== "All" && col !== "Category")
            filter["data.Category"] = Category;

        const values = await surveyCol.distinct(path, filter);

        if (!values.length) {
            return res.json([{ value: "All", label: "All" }]);
        }

        // 2️⃣ Fetch labels for mapping
        const labels = await labelCol.find({ Variable: col }).toArray();

        const labelMap = {};
        labels.forEach((lbl) => {
            labelMap[String(lbl.Value)] = lbl.Label;
        });

        // 3️⃣ Build final options
        const final = values
            .filter((v) => v !== null && v !== undefined && v !== "")
            .map((v) => ({
                value: String(v),
                label: labelMap[String(v)] || String(v),
            }));

        res.json([...final]);
    } catch (err) {
        console.error("getOptions error:", err);
        res.status(500).json({ message: "Error fetching options" });
    }
};
