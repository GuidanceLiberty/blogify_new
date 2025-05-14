import express from "express";
import { createPost, deletePost, getLikedPosts, getPost, getPosts, getSinglePost, likeUnlikePost, updatePost } from "../controllers/post.contoller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/', verifyToken, getPosts);
router.post('/', verifyToken, createPost);
router.get('/:slug', verifyToken, getPost);
router.get('/single-post/:slug', verifyToken, getSinglePost);
router.put('/:slug', verifyToken, updatePost);
router.delete('/:slug', verifyToken, deletePost);
router.post('/like-and-unlike-post', verifyToken, likeUnlikePost);
router.get('/likes/:user_id', verifyToken, getLikedPosts);

export default router