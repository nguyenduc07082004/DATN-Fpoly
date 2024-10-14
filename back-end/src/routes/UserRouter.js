// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserControllers");
const authMiddleware = require("../middleware/authmiddleware"); 


// Lấy danh sách sản phẩm
router.get("/",//authMiddleware,
UserController.getUser);

// Thêm sản phẩm
router.post("/add",//authMiddleware, 
UserController.addUser);

// Cập nhật sản phẩm
router.put("/edit/:id",//authMiddleware, 
UserController.updateUser);

// Xóa sản phẩm
router.delete("/:id",//authMiddleware,
UserController.deleteUser);

module.exports = router;
