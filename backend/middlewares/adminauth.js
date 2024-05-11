
const jwt = require("jsonwebtoken");
const { Admin } = require("../models/AdminModel"); // Import the Admin model

// Middleware function to authenticate admins
const adminAuth = async (req, res, next) => {
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
    const decoded = jwt.verify(token, "your_secret_key");

    // Check if the username exists in the database
    const admin = await Admin.findOne({ username: decoded.username });

    if (!admin) {
      return res.status(401).json({ error: "Admin not found" });
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

module.exports = { adminAuth };
