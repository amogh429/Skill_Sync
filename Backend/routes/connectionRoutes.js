import express from "express";
import {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getConnections
} from "../controllers/connectionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📤 Send connection request
// POST /api/connections/:id
router.post("/:id", protect, sendRequest);

// ✅ Accept connection request
// PUT /api/connections/:id/accept
router.put("/:id/accept", protect, acceptRequest);

// ❌ Reject connection request
// PUT /api/connections/:id/reject
router.put("/:id/reject", protect, rejectRequest);

// 🤝 Get all accepted connections
// GET /api/connections
router.get("/", protect, getConnections);

export default router;