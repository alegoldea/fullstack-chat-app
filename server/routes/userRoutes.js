const express = require("express");
const {
  registerUser,
  authenticateUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authenticateUser);

module.exports = router;
