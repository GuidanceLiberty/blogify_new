import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // ✅ Reference to Comment, not 'comment'
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ Export the model with capital 'C' to match reference in population
export const Comment = mongoose.model("Comment", CommentSchema);
