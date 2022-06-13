const express = require("express");
const {
  registerUser,
  authUser,
  searchUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, searchUsers);
router.post("/login", authUser);

module.exports = router;
