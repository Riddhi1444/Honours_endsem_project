const bcrypt = require("bcrypt");

const { User } = require("../models/UserModel"); // Import the User model

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.username;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // If user not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare old password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    // Password updated successfully
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAbout = async (req, res) => {
  const { newAbout } = req.body;
  const username = req.username;

  try {
    // Find the user by username and update the about field
    await User.updateOne({ username }, { about: newAbout });

    // About updated successfully
    res.status(200).json({ message: "About updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateName = async (req, res) => {
  const { newName } = req.body;
  const username = req.username;

  try {
    // Find the user by username and update the name field
    await User.updateOne({ username }, { name: newName });

    // Name updated successfully
    res.status(200).json({ message: "Name updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateAbout, updateName, updatePassword };