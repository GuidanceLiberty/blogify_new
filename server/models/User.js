import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  photo: { type: String, default: "default.png" },

  // Relationships
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

  // User info
  lastLogin: { type: Date },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: 'User' },

  // Optional analytics
  noOfPosts: { type: Number, default: 0 },
  noOfLikedPosts: { type: Number, default: 0 },
  noOfComments: { type: Number, default: 0 },
  lastCommentDate: { type: Date, default: null },

  // Auth tokens
  verificationToken: { type: String, index: true },
  verificationTokenExpiresAt: Date,
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
