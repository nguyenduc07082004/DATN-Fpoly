// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {register,login} = require("../controllers/UserControllers");
// const authMiddleware = require("../middleware/authmiddleware");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
