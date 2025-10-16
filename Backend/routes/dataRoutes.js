import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/**
 * ✅ 1️⃣ Get completed survey data
 * Optional query params:
 *   ?status=Completed (default)
 *   ?labels=true → replace codes with value labels
 */
router.get("/survey-data", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const surveyCol = db.collection("surveyresponses");
        const varLabelCol = db.collection("var_labels");
        const valLabelCol = db.collection("val_labels");

        const { status, labels } = req.query;
        const filter = { "data.phase1_status": status || "Completed" };

        // 🧹 Excluded system fields
        const excluded = [
            "_id",
            "__v",
            "uid",
            "createdAt",
            "unique_id",
            "phase1_status",
            "updatedAt",
            "username",
        ];

        // ✅ Get variables list (filtered)
        const varDocs = await varLabelCol
            .find(
                { Variable: { $nin: excluded } },
                { projection: { _id: 0, Variable: 1, Label: 1 } }
            )
            .toArray();

        const variables = varDocs.map((v) => v.Variable);

        // ✅ Projection for only selected variables
        const projection = {};
        variables.forEach((v) => (projection[`data.${v}`] = 1));

        const docs = await surveyCol.find(filter, { projection }).toArray();

        // ✅ Variable labels map
        const varLabelMap = {};
        varDocs.forEach((v) => (varLabelMap[v.Variable] = v.Label));

        // ✅ Value labels map
        const valDocs = await valLabelCol
            .find({}, { projection: { _id: 0, Variable: 1, Value: 1, Label: 1 } })
            .toArray();

        const valueLabelMap = {};
        valDocs.forEach((v) => {
            if (!valueLabelMap[v.Variable]) valueLabelMap[v.Variable] = {};
            valueLabelMap[v.Variable][String(v.Value)] = v.Label;
        });

        // ✅ Safely transform multi-select values
        const transformValueLabel = (variable, val, labelMode) => {
            const labelMap = valueLabelMap[variable];
            if (!labelMap) return val ?? "";

            const mappedLabel = labelMap[String(val)];

            if (labelMode === "true") {
                if (typeof mappedLabel === "string") {
                    const lower = mappedLabel.toLowerCase();
                    if (lower.includes("selected") && !lower.includes("not")) return 1;
                    if (lower.includes("not selected")) return 0;
                }
                // otherwise normal label
                return mappedLabel ?? val ?? "";
            }

            return val ?? "";
        };

        // ✅ Build final clean dataset
        const cleaned = docs.map((doc) => {
            const d = doc.data || {};
            const row = {};
            variables.forEach((v) => {
                const val = d[v];
                row[v] = transformValueLabel(v, val, labels);
            });
            return row;
        });

        // ✅ Filtered headers
        const filteredHeaders = Object.fromEntries(
            Object.entries(varLabelMap).filter(([key]) => !excluded.includes(key))
        );

        res.json({
            data: cleaned,
            headers: filteredHeaders,
        });
    } catch (err) {
        console.error("Error fetching survey data:", err);
        res.status(500).json({ message: "Error fetching survey data" });
    }
});
/**
 * ✅ 2️⃣ Get variable labels (defines column headers)
 * Returns: Variable, Label
 */
// ✅ Get variable labels (defines table columns)
router.get("/var_labels", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const labelCol = db.collection("var_labels");

        const excluded = [
            "_id",
            "__v",
            "uid",
            "createdAt",
            "unique_id",
            "phase1_status",
            "updatedAt",
            "username",
        ];

        const labels = await labelCol
            .find(
                { Variable: { $nin: excluded } }, // ✅ Exclude directly in query
                { projection: { _id: 0, Variable: 1, Label: 1, Value: 1 } }
            )
            .toArray();

        res.json(labels);
    } catch (err) {
        console.error("Error fetching labels:", err);
        res.status(500).json({ message: "Error fetching labels" });
    }
});


/**
 * ✅ 3️⃣ Get value labels (for answer text)
 * Returns: Variable, Value, Label
 */
router.get("/val_labels", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const labelCol = db.collection("val_labels");

        const valLabels = await labelCol
            .find(
                { Value: { $exists: true } },
                { projection: { _id: 0, Variable: 1, Value: 1, Label: 1 } }
            )
            .toArray();

        const excluded = [
            "_id",
            "__v",
            "uid",
            "createdAt",
            "unique_id",
            "phase1_status",
            "updatedAt",
            "username",
        ];

        const filtered = valLabels.filter(
            (l) => l.Variable && !excluded.includes(l.Variable)
        );

        res.json(filtered);
    } catch (err) {
        console.error("Error fetching val_labels:", err);
        res.status(500).json({ message: "Error fetching val_labels" });
    }
});

export default router;
