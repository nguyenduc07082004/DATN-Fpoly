
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryControllers");
const authMiddleware = require("../middleware/authmiddleware"); 

// Lấy danh sách sản phẩm
router.get("/",categoryController.getCategory);

// Thêm sản phẩm
router.post("/add",//authMiddleware, 
 categoryController.addCategory);

// Cập nhật sản phẩm
router.put("/edit/:id", //authMiddleware,
categoryController.updateCategory);

// Xóa sản phẩm
router.delete("/:id",//authMiddleware,
categoryController.deleteCategory);

module.exports = router;
