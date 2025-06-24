import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  photo: { type: String },

  // Relationships
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

  // User info
  lastLogin: { type: Date },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: 'User' },

  // Optional analytics (can be updated later)
  noOfPosts: { type: Number, default: 0 },
  noOfLikedPosts: { type: Number, default: 0 },
  noOfComments: { type: Number, default: 0 },
  lastCommentDate: { type: Date, default: null },

  // Auth tokens
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
