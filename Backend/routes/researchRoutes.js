// backend/routes/researchRoutes.js
import express from "express";
import { getQualData } from "../controllers/researchProgressQualController.js";
const router = express.Router();

router.get("/", getQualData);

export default router;
