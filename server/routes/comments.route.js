import  express  from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addComment, getComments } from "../controllers/comment.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get('/:post_id', getComments);
router.post('/', addComment);

export default router;
