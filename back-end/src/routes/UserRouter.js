// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUser,
  disableUser,
} = require("../controllers/UserControllers");
// const authMiddleware = require("../middleware/authmiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/users", getUser);
router.patch("/users/disable/:id", disableUser);

module.exports = router;
