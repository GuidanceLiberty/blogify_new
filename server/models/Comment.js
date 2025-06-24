import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  comment: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "comment", default: null }
}, { timestamps: true });

export const Comment = mongoose.model('comment', CommentSchema);
