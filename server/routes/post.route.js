import express from "express";
import {
  createPost,
  deletePost,
  getLikedPosts,
  getPost,
  getPosts,
  getSearchPosts,
  getSinglePost,
  getUserPosts,
  likeUnlikePost,
  updatePost
} from "../controllers/post.contoller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Public routes (no auth required)
router.get('/search', getSearchPosts);
router.get('/user-posts/:user_id', getUserPosts); // ✅ MUST come before '/:slug'
router.get('/single-post/:slug', getSinglePost);  // ✅ Also before '/:slug'
router.get('/:slug', getPost);                    // ⚠️ Catch-all route — always last of public routes

// ✅ Authenticated routes
router.use(verifyToken);

router.get('/', getPosts);
router.post('/', createPost);
router.put('/:slug', updatePost);
router.delete('/:slug', deletePost);
router.post('/like-and-unlike-post', likeUnlikePost);
router.get('/likes/:user_id', getLikedPosts);

export default router;
