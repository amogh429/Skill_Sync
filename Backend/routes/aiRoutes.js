import express from "express";
import { extractSkills } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/extract-skills", protect, extractSkills);

export default router;
