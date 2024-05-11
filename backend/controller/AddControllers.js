
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModel");
const { Post } = require("../models/PostModel");
const addUser = async (req, res) => {
  try {
    const { username, name, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    // Create and return jwt token
    const token = jwt.sign({ username }, "your_secret_key");
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addPost = async (req, res) => {
  // Req post
  try {
    // Get the user ID from the authentication middleware
    const username = req.username;
    const existingUser = await User.findOne({ username });
    console.log(existingUser);

    // Extract post data from request body
    const { title, content } = req.body;

    // Create a new post document
    const newPost = new Post({
      uploader: existingUser._id,
      title,
      content,
    });

    // Save the new post to the database
    await newPost.save();

    // Update the user's uploadedPosts array with the new post's ID
    await User.findOneAndUpdate(
      { username },
      {
        $push: { uploadedPosts: newPost._id },
      }
    );

    // Send a success response
    return res
      .status(201)
      .json({ message: "Post added successfully.", post: newPost });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { addPost, addUser };
