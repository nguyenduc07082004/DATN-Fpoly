// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserControllers");


// Lấy danh sách sản phẩm
router.get("/",UserController.getUser);

// Thêm sản phẩm
router.post("/add", UserController.addUser);

// Cập nhật sản phẩm
router.put("/edit/:id", UserController.updateUser);

// Xóa sản phẩm
router.delete("/:id",UserController.deleteUser);

module.exports = router;
