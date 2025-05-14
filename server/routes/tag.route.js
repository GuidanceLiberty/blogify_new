import express from 'express';
import { getTag } from '../controllers/tag.controller.js';

const router = express.Router();

router.get('/', getTag);

export default router;