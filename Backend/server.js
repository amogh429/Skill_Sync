import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import  userRoutes  from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/matches',matchRoutes);

app.get('/api/protected', protect , (req,res) => {
  res.json({message: `Hello ${req.user.name}, you are authorized`});
})

// Base Routes
app.get('/',(req,res) => {
  res.send('SkillSync is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT , () => console.log(`Server running on port ${PORT}`))