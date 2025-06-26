import url from 'url';
import mongoose from 'mongoose';
import { Comment } from '../models/Comment.js';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

const { ObjectId } = mongoose.Types;

// ------------------ Get Comments ------------------
export const getComments = async (req, res) => {
  const { post_id } = req.params;
  const queryObject = url.parse(req.url, true).query;
  const limit = parseInt(queryObject.limit) || 100;

  try {
    const allComments = await Comment.find({ postId: new ObjectId(post_id) })
      .populate({
        path: "author",
        model: User,
        select: "_id name email photo",
      })
      .sort({ createdAt: 1 })
      .exec();

    if (!allComments || allComments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No comments found",
        comments: [],
      });
    }

    const groupedComments = [];
    const repliesMap = {};
    const commentById = {};

    for (const comment of allComments) {
      const c = comment.toObject();
      commentById[c._id] = c;

      if (c.parentCommentId) {
        const parentId = c.parentCommentId.toString();
        if (!repliesMap[parentId]) repliesMap[parentId] = [];

        const parentComment = allComments.find(p => p._id.toString() === parentId);
        const parentAuthorName = parentComment?.author?.name || "Unknown";
        c.parentAuthorName = parentAuthorName;

        repliesMap[parentId].push(c);
      } else {
        groupedComments.push({ ...c, replies: [] });
      }
    }

    for (let comment of groupedComments) {
      const commentId = comment._id.toString();
      if (repliesMap[commentId]) {
        comment.replies = repliesMap[commentId];
      }
    }

    return res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      comments: groupedComments,
    });

  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve comments",
      error: error.message,
    });
  }
};

// ------------------ Add Comment / Reply ------------------
export const addComment = async (req, res) => {
  const { comment, user_id, post_id, parentCommentId } = req.body;

  try {
    // 🔐 Validate required fields
    if (!comment || !user_id || !post_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(post_id) || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post or user ID",
      });
    }

    const post = await Post.findById(post_id).populate("author");
    const user = await User.findById(user_id);
    if (!post || !user) {
      return res.status(404).json({
        success: false,
        message: "Post or User not found",
      });
    }

    const newComment = await Comment.create({
      comment,
      postId: post_id,
      author: user_id,
      parentCommentId: parentCommentId || null,
    });

    if (!parentCommentId) {
      post.comments.unshift(newComment._id);
      await post.save();
    }

    await User.findByIdAndUpdate(user_id, {
      $inc: { noOfComments: 1 },
      $set: { lastCommentDate: new Date() },
    });

    // ----------- Notification Logic -----------
    const notificationBase = {
      sender: user._id,
      postId: post._id,
      commentId: newComment._id,
      slug: post.slug,
      read: false,
    };

    // Notify post author
    if (post.author._id.toString() !== user_id) {
      await Notification.create({
        ...notificationBase,
        recipient: post.author._id,
        type: parentCommentId ? "reply" : "comment",
        message: `${user.name} ${parentCommentId ? "replied to a comment" : "commented on your post"}.`,
      });
    }

    // Notify parent comment author (if replying)
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId).populate("author");
      if (
        parentComment &&
        parentComment.author._id.toString() !== user_id &&
        parentComment.author._id.toString() !== post.author._id.toString()
      ) {
        await Notification.create({
          ...notificationBase,
          recipient: parentComment.author._id,
          type: "reply",
          message: `${user.name} replied to your comment.`,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: parentCommentId ? "Reply posted successfully" : "Comment posted successfully",
      data: newComment,
    });

  } catch (error) {
    console.error("Error in addComment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to post comment",
      error: error.message,
    });
  }
};
