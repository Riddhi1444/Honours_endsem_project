const express = require("express");
const router = express.Router();
const {
  fetchAllPosts,
  fetchOnePost,
  fetchAllPostsOfUser,
} = require("../controller/FetchingControllers");
const { addPost } = require("../controller/AddControllers");
const { userAuth } = require("../middlewares/userauth");

router.get("/getAllPosts", fetchAllPosts);
router.get("/user/getAllPosts", userAuth, fetchAllPostsOfUser);
router.get("/searchPosts", fetchAllPosts);
router.get("/getOnePosts/:id", fetchOnePost);
router.post("/addpost", userAuth, addPost);

module.exports = router;