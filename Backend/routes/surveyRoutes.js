// backend/routes/surveyRoutes.js
import express from "express";
import { getSurveyData } from "../controllers/surveysController.js";
const router = express.Router();

router.get("/", getSurveyData);

export default router;
