const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controller/AuthControllers");

router.post("/admin/login", adminLogin);

module.exports = router;