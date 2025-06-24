import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  slug: { type: String, unique: true, required: true },
  body: { type: String, required: true },
  categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  photo: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchema);
