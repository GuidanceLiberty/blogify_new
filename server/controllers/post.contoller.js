import { ObjectId } from "mongodb";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";
import url from "url";
import { postSchema } from "../schemas/index.js";

// -------------------- Get All Posts --------------------
export const getPosts = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const query = parseUrl.query;

  try {
    let limit = query.limit || 100;

    const posts = await Post.find()
      .populate({ path: "author", model: User, select: "_id name email photo" })
      .populate({ path: "categories", model: Category, select: "_id name description" })
      .sort({ createdAt: "desc" })
      .limit(limit)
      .exec();

    if (!posts || posts.length === 0) {
      return res.status(404).json({ success: false, message: "No posts found" });
    }

    res.status(200).json({ success: true, message: "Posts retrieved", posts });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// -------------------- Create Post --------------------
export const createPost = async (req, res) => {
  const { title, body, categories, photo, author } = req.body;
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  const image = photo?.length > 12 ? photo.substring(12) : null;

  const { error } = postSchema.validate({ title, slug, body, categories, author });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const postExist = await Post.findOne({ slug, author });
    if (postExist) {
      return res.status(400).json({ success: false, message: "Post already exists" });
    }

    const post = new Post({ title, slug, body, categories, photo: image, author });
    await post.save();

    res.status(201).json({ success: true, message: "Post created successfully", post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Get Post by Slug --------------------
export const getPost = async (req, res) => {
  const slug = req.params.slug;

  try {
    if (!slug) throw new Error("Post slug is required");

    const post = await Post.findOne({ slug })
      .populate({ path: "author", model: User, select: "_id name email photo" })
      .populate({ path: "categories", model: Category, select: "_id name description" });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, message: `${post.title} found`, data: post });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// -------------------- Get Single Post --------------------
export const getSinglePost = async (req, res) => {
  const slug = req.params.slug;

  try {
    if (!slug) throw new Error("Post slug is required");

    const post = await Post.findOne({ slug })
      .populate({ path: "author", model: User, select: "_id name email photo" })
      .populate({ path: "categories", model: Category, select: "_id name description" });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, message: `${post.title} found`, data: post });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// -------------------- Get User Posts --------------------
export const getUserPosts = async (req, res) => {
  const userId = req.params.user_id;
  const parseUrl = url.parse(req.url, true);
  const query = parseUrl.query;
  try {
    let limit = query.limit || 100;

    const posts = await Post.find({ author: userId })
      .populate({ path: "author", model: User, select: "_id name email photo" })
      .populate({ path: "categories", model: Category, select: "_id name description" })
      .sort({ createdAt: "desc" })
      .limit(limit);

    if (!posts || posts.length === 0) {
      return res.status(404).json({ success: false, message: "No posts by this user found" });
    }

    res.status(200).json({ success: true, message: "User posts retrieved", data: posts });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// -------------------- Update Post --------------------
export const updatePost = async (req, res) => {
  const post_slug = req.params.slug;
  const { title, body, categories, photo, author } = req.body;

  const slug = title.toLowerCase().replace(/\s+/g, "-");
  const cate_id = new ObjectId(categories);
  const image = photo?.length > 12 ? photo.substring(12) : null;

  const { error } = postSchema.validate({ title, slug, body, categories, author });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const updateData = { title, slug, body, categories: cate_id };
    if (image) updateData.photo = image;

    const updatedPost = await Post.findOneAndUpdate({ slug: post_slug }, updateData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ success: false, message: "Failed to update post!" });
    }

    res.status(200).json({ success: true, message: "Post updated successfully!", updatedPost });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// -------------------- Delete Post --------------------
export const deletePost = async (req, res) => {
  const slug = req.params.slug;

  try {
    const post = await Post.findOneAndDelete({ slug });
    if (!post) {
      return res.status(404).json({ success: false, message: "Failed to delete post" });
    }

    res.status(200).json({ success: true, message: "Post deleted successfully", data: post });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// -------------------- Like/Unlike Post --------------------
export const likeUnlikePost = async (req, res) => {
  const { user_id, post_id } = req.body;
  const userId = new ObjectId(user_id);
  const postId = new ObjectId(post_id);

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post || !user) {
      return res.status(404).json({ success: false, message: "User or Post not found" });
    }

    let liked = false;
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $addToSet: { likes: userId } });
      await user.updateOne({ $addToSet: { likes: postId } });
      liked = true;
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      await user.updateOne({ $pull: { likes: postId } });
    }

    return res.status(200).json({ success: true, message: liked ? "Post liked" : "Post unliked" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Get Liked Posts --------------------
export const getLikedPosts = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const query = parseUrl.query;
  const user_id = req.params.user_id;

  try {
    let limit = query.limit || 100;

    const user = await User.findById(user_id)
      .select("-password")
      .populate({
        path: "likes",
        model: Post,
        select: "_id title slug categories body photo createdAt",
        populate: [
          { path: "author", model: User, select: "_id name email photo" },
          { path: "categories", model: Category, select: "_id name" },
        ],
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Liked posts fetched", data: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// -------------------- Search Posts --------------------
export const getSearchPosts = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const query = parseUrl.query;

  try {
    const limit = query.limit || 100;
    const q = query.q || "";

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
        { body: { $regex: q, $options: "i" } },
      ],
    })
      .populate({ path: "author", model: User, select: "_id name email photo" })
      .populate({ path: "categories", model: Category, select: "_id name description" })
      .sort({ createdAt: "desc" })
      .limit(limit);

    if (!posts || posts.length === 0) {
      return res.status(404).json({ success: false, message: "No posts found" });
    }

    res.status(200).json({ success: true, message: "Search results", posts });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
