import express from 'express';
import { getNotifications, markAllAsRead } from '../controllers/notification.controller.js';
import {requireAuth} from '../middleware/requireAuth.js';

const router = express.Router();

// Protect all routes
router.use(requireAuth);

// Routes
router.get('/:userId', getNotifications);
router.patch('/mark-as-read/:userId', markAllAsRead); // ✅ Add this line

export default router;
