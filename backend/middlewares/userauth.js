const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModel"); // Import the User model

// Middleware function to authenticate users
const userAuth = async (req, res, next) => {
  // Extract token from headers
  const authHeader = req.headers.authorization;

  // Check if authorization header is provided
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Split authorization header by space
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the username exists in the database
    const user = await User.findOne({ username: decoded.username });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Set req.username with the decoded username
    req.username = decoded.username;

    // Call next middleware
    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { userAuth };