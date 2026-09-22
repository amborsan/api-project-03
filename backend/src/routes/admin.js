import express from 'express';
const router = express.Router();
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

// Example route requiring authentication and admin role
router.get('/', authenticateToken, authorizeRole('ADMIN'), (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

export default router;
