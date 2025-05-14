import  express  from "express";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/category.controller.js";
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();



router.get('/',  getCategories);
router.post('/', createCategory);
router.get('/:category_id', getCategory);
router.put('/:category_id', updateCategory);
router.delete('/:category_id', deleteCategory);

export default router;