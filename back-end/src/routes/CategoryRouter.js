
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryControllers");

// Lấy danh sách sản phẩm
router.get("/",categoryController.getCategory);

// Thêm sản phẩm
router.post("/add", categoryController.addCategory);

// Cập nhật sản phẩm
router.put("/edit/:id", categoryController.updateCategory);

// Xóa sản phẩm
router.delete("/:id",categoryController.deleteCategory);

module.exports = router;
