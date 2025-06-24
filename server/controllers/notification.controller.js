import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js"; // ✅ Make sure Post schema is registered

// ------------------ Get Notifications for a User ------------------
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 }) // Newest first
      .populate("sender", "name photo") // Get sender info
      .populate("postId", "slug") // ✅ Pull slug from post
      .limit(50)
      .lean();

    // Format response for frontend
    const formatted = notifications.map((notif) => ({
      ...notif,
      slug: notif?.postId?.slug || "", // fallback if postId was deleted
      postId: notif?.postId?._id || notif.postId, // either full object or original ID
    }));

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications: formatted,
    });

  } catch (err) {
    console.error("Error fetching notifications:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: err.message,
    });
  }
};

// ------------------ Mark All as Read ------------------
export const markAllAsRead = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });

  } catch (err) {
    console.error("Error marking notifications as read:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
      error: err.message,
    });
  }
};
