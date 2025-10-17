import express from "express";
import { loginUser } from "../controllers/loginController.js";

const router = express.Router();

// Use POST to accept credentials in the request body
router.post('/', loginUser);

export default router;
