// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import surveyRoutes from "./routes/surveyRoutes.js";
import optionsRoutes from "./routes/optionsRoutes.js";
import dashoptionsRoutes from "./routes/dashoptionsRoutes.js";
import dashboardquestion from "./routes/chartRoutes.js"
import mapRoutes from "./routes/mapRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Existing routes
app.use("/api/surveys", surveyRoutes);
app.use("/api/options", optionsRoutes);
app.use("/api/dash-options", dashoptionsRoutes);
app.use("/api/map-data", mapRoutes);
app.use("/api", dataRoutes);
app.use("/api", dashboardquestion); // ✅ all /api/* endpoints come from chartRoutes
app.use("/api/login", loginRoutes);


// ✅ LOGIN ROUTE (POST)
// app.post("/api/login", async (req, res) => {
//     console.log("🔥 /api/login POST route hit!");
//     console.log("📦 Body:", req.body);

//     try {
//         const { username, password } = req.body;
//         if (!username || !password) {
//             return res.status(400).json({ message: "Missing username or password" });
//         }

//         const db = mongoose.connection.db;
//         const userCol = db.collection("user_cred");
//         const user = await userCol.findOne({ username });

//         if (!user) return res.status(404).json({ message: "User not found" });
//         if (user.password !== password)
//             return res.status(401).json({ message: "Invalid password" });

//         const token = jwt.sign(
//             { id: user._id, username: user.username },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//         );

//         res.json({ message: "Login successful", token });
//     } catch (error) {
//         console.error("❌ Login Error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// ✅ Test route
app.get("/", (req, res) => res.send("API is running..."));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
