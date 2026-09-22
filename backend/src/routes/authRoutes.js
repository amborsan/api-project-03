import express from 'express';
const router = express.Router();
import { registerUser, loginUser, logoutUser } from '../controllers/user-controller.js';

// User Registration Route
router.post('/register', registerUser);

// User Login Route
router.post('/login', loginUser);

// User Logout Route
router.get('/logout', logoutUser); // Typically this is a GET request as it doesn't require sending data

export default router;