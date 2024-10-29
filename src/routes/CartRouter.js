const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartControllers"); // Thay đổi đường dẫn nếu cần
const authMiddleware = require("../middleware/authmiddleware"); // Sử dụng middleware xác thực nếu cần

// Lấy danh sách sản phẩm trong giỏ hàng
router.get('/cart', CartController.getCart);          // Lấy giỏ hàng
router.post('/cart', CartController.addToCart);       // Thêm sản phẩm vào giỏ hàng
router.put('/cart/update', CartController.updateCart); // Cập nhật số lượng sản phẩm
router.delete('/cart/remove', CartController.removeFromCart); // Xóa sản phẩm khỏi giỏ hàng

module.exports = router;