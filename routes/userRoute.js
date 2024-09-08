const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/register", upload, registerUser);
router.post("/login", loginUser);

module.exports = router;
