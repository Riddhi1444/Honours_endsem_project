const mongoose = require("mongoose");

// Define Post schema
const postSchema = new mongoose.Schema({
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
//   uploaddate

  content: {
    type: String,
    required: true,
  },
  isUploaded: {
    type: Boolean,
    default: false,
  },
  isDraft: {
    type: Boolean,
    default: true,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };