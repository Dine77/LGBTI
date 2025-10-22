// backend/routes/optionsRoutes.js
import express from "express";
import { getdashOptions } from "../controllers/dashoptionsController.js";
const router = express.Router();

router.get("/", getdashOptions);

export default router;
