
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models/AdminModel");
const { User } = require("../models/UserModel");

const userSignIn = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists. Please choose a different username.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      about: "",
      draftPosts: [],
      uploadedPosts: [],
    });

    // Save the user to the database
    await newUser.save();

    // Create a JWT token
    const token = jwt.sign({ username: username }, process.env.JWT_SECRET);

    // Respond with success message and JWT token
    return res
      .status(201)
      .json({ message: "User created successfully.", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ username: username });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found. Please sign up." });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ message: "Invalid password. Please try again." });
    }

    // Generate JWT token
    const token = jwt.sign({ username: username }, process.env.JWT_SECRET);

    // Send acknowledgment with token
    return res.status(200).json({ message: "Login successful.", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    let admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found." });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ message: "Invalid password. Please try again." });
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, "your_secret_key_here", {
      expiresIn: "1h",
    });

    // Send acknowledgment with token
    return res.status(200).json({ message: "Login successful.", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { userLogin, userSignIn, adminLogin };
