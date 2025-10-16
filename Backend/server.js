// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import surveyRoutes from "./routes/surveyRoutes.js";
import optionsRoutes from "./routes/optionsRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api/surveys", surveyRoutes);
app.use("/api/options", optionsRoutes);
app.use("/api/map-data", mapRoutes);
app.use("/api", dataRoutes);

// Test route
app.get("/", (req, res) => res.send("API is running..."));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
