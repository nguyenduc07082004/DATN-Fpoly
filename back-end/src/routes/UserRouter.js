// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const { register, login, getUser } = require("../controllers/UserControllers");
const { checkAuth } = require("../middleware/checkAuth");
const { checkIsAdmin } = require("../middleware/adminChecking");
// const authMiddleware = require("../middleware/authmiddleware");
router.post("/register", register);
router.post("/login", login);

// router.use(checkAuth, checkIsAdmin);
router.get("/users", getUser);
router.get("/users/:id", getUserById);

module.exports = router;
