// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductControllers");

// Lấy danh sách sản phẩm
router.get("/",productController.getProducts);

// Thêm sản phẩm
router.post("/add", productController.addProduct);

// Cập nhật sản phẩm
router.put("/edit/:id", productController.updateProduct);

// Xóa sản phẩm
router.delete("/:id",productController.deleteProduct);

module.exports = router;
