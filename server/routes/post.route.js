import express from "express";
import {
  createPost,
  deletePost,
  getLikedPosts,
  getPost,
  getPosts,
  getSearchPosts,
  getSinglePost,
  getUserPosts, // ✅ IMPORTED NEW CONTROLLER
  likeUnlikePost,
  updatePost
} from "../controllers/post.contoller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Public route
router.get('/search', getSearchPosts);

// ✅ This must be above `/:slug` to avoid being overridden
router.get('/user-posts/:user_id', getUserPosts); 

// ✅ Authenticated routes
router.use(verifyToken);

router.get('/', getPosts);
router.post('/', createPost);
router.get('/:slug', getPost);
router.get('/single-post/:slug', getSinglePost);
router.put('/:slug', updatePost);
router.delete('/:slug', deletePost);
router.post('/like-and-unlike-post', likeUnlikePost);
router.get('/likes/:user_id', getLikedPosts);

export default router;
