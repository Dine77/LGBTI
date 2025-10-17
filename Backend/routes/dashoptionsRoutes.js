// backend/routes/optionsRoutes.js
import express from "express";
import { getOptions } from "../controllers/dashoptionsController.js";
const router = express.Router();

router.get("/", getOptions);

export default router;
