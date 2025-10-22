import express from "express";
import { getAllQuestions, getChartData } from "../controllers/chartController.js";
import { getSRChartData } from "../controllers/chartSRController.js";
import { getMRChartData } from "../controllers/chartMRController.js";

const router = express.Router();

// 🧠 Get all questions metadata
router.get("/questions", getAllQuestions);

// 📊 Get combined chart data (SR + MR later)
router.get("/chart-data", getChartData);

// 🧩 Get only SR chart data by section
router.get("/chart-data/sr", getSRChartData);

// 🧩 Get only MR chart data by group
router.get("/chart-data/mr", getMRChartData);

export default router;
