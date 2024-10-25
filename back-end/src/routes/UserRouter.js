// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserControllers");
// const authMiddleware = require("../middleware/authmiddleware");

router.get(
  "/", //authMiddleware,
  UserController.getUser
);

// router goi link login and register

router.put(
  "/edit/:id", //authMiddleware,
  UserController.updateUser
);

router.delete(
  "/:id", //authMiddleware,
  UserController.deleteUser
);

module.exports = router;
