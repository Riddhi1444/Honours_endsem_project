const express = require("express");
const router = express.Router();
const { userLogin, userSignIn } = require("../controller/AuthControllers");
const {
  fetchAllUsers,

  fetchOneUser,
} = require("../controller/FetchingControllers");
const { addUser } = require("../controller/AddControllers");
const { userAuth } = require("../middlewares/userauth");

const { adminAuth } = require("../middlewares/adminauth");

const {
  updateAbout,
  updateName,
  updatePassword,
} = require("../controller/UpdateController");

router.post("/user/signin", userSignIn);
router.post("/user/login", userLogin);

router.get("/getAllUsers", adminAuth, fetchAllUsers);
router.get("/getOneUsers", adminAuth, fetchOneUser);

router.post("/addUser", adminAuth, addUser);

router.put("/user/updateName", userAuth, updateName);
router.put("/user/updateAbout", userAuth, updateAbout);
router.put("/user/updatePassword", userAuth, updatePassword);

module.exports = router;