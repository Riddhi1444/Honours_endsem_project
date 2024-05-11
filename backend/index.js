const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
require("dotenv").config();

const AdminRoutes = require("./routes/AdminRoutes");
const UserRoutes = require("./routes/UserRoutes");
const PostRoutes = require("./routes/PostRoutes");

// MongoDB Atlas connection URI
const uri = process.env.MONGODB_URI;

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(uri);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

app.use(AdminRoutes);
app.use(UserRoutes);
app.use(PostRoutes);

app.listen(8080, () => {
  console.log("Listening on port 8080");
});