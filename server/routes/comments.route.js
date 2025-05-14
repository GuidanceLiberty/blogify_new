import  express  from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addComment, getComments } from "../controllers/comment.controller.js";

const router = express.Router();

router.get('/:post_id', verifyToken, getComments);
router.post('/', verifyToken, addComment);

export default router;
