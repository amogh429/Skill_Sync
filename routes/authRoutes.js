import express from 'express';
import { registerUser } from '../controllers/authControllers.js';
import { loginUser } from '../controllers/authControllers.js';
import { body } from 'express-validator';
const router = express.Router();

// Validation Rules
const registervalidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is requred'),
    body('password').isLength({min:6}).withMessage('Password must be alteast 6 characcters')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registervalidation, registerUser);
router.post('/login', loginValidation,loginUser);

export default router;
