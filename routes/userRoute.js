const express = require("express");
const {
  registerUser,
  loginUser,
  googleLogin,
} = require("../controllers/userController");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/register", upload, registerUser);
router.post("/login", loginUser);
router.get("/google-login", googleLogin);

module.exports = router;
