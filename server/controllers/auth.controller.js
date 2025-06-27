import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateTokenSetCookie } from "../util/generateTokenSetCookie.js";
import { loginSchema, signupSchema } from "../schemas/index.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import crypto from "crypto";

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -verificationToken");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User found", user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const signup = async (req, res) => {
  const { name, email, password, photo } = req.body;
  const { error } = signupSchema.validate({ name, email, password });

  let image;
  if (photo?.length > 12) {
    image = photo.substring(12);
  }

  try {
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      photo: image,
      verificationToken,
    });

    await user.save();
    generateTokenSetCookie(res, user._id);
    // await sendVerificationEmail(email, name, verificationToken);

    const { password: _, verificationToken: __, ...safeUser } = user._doc;

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginSchema.validate({ email, password });

  try {
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateTokenSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    const { password: _, verificationToken: __, ...safeUser } = user._doc;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { token, ...safeUser },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;
  try {
    const user = await User.findOne({ verificationToken: verificationCode });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    const { password: _, verificationToken: __, ...safeUser } = user._doc;

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      code: resetToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const user = await User.findById(userId).select("-password -verificationToken -__v");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'User',
        photo: user.photo || null,
        lastLogin: user.lastLogin || null,
        isVerified: user.isVerified || false,
        createdAt: user.createdAt || null,
        likes: user.likes || [],
        noOfPosts: user.noOfPosts || 0,
        noOfComments: user.noOfComments || 0,
        noOfLikedPosts: user.noOfLikedPosts || 0,
        lastCommentDate: user.lastCommentDate || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logout successfully" });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -verificationToken -__v");
    if (users.length > 0) {
      return res.status(200).json({ success: true, users });
    }
    return res.status(404).json({ success: false, message: "No users found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
