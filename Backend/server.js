import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

connectDB();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://skill-sync-nine-iota.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SkillSync API is running",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you are authorized` });
});

// Base Routes
app.get("/", (req, res) => {
  res.send("SkillSync is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
