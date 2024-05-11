
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models/AdminModel");
const { Post } = require("../models/PostModel");
const { User } = require("../models/UserModel");

const fetchAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("uploader", "username"); // Populate uploader field with username

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const fetchOnePost = async (req, res) => {
  // Res id
  try {
    const postId = req.params.id; // Assuming the post ID is passed in the request URL

    // Find the post by ID
    const post = await Post.findById(postId).populate(
      "uploader",
      "username name"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // If the post is found, send it to the client
    return res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const fetchAllUsers = async (req, res) => {
  try {
    // Ensure the user accessing this endpoint is an admin
    const adminUsername = req.username;
    const admin = await Admin.findOne({ username: adminUsername });
    if (!admin) {
      return res
        .status(401)
        .json({ error: "Unauthorized access. Admin privileges required." });
    }

    // Fetch all users data
    const users = await User.find({}, { password: 0 }); // Excluding password from the response

    // Send the users data to the client
    return res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const fetchOneUser = async (req, res) => {
  try {
    const { username } = req.params;

    // Check if the user is an admin
    if (!req.isAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Find the user by username
    const user = await Admin.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's data
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAllPostsOfUser = async (req, res) => {
  try {
    // Assuming req.username is set by your middleware
    const username = req.username;

    // Find the user based on the username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find all posts by the user
    const posts = await Post.find({ userId: user._id });

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  fetchAllPosts,
  fetchAllUsers,
  fetchOnePost,
  fetchOneUser,
  fetchAllPostsOfUser,
};
