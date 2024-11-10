
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartControllers"); // Thay đổi đường dẫn nếu cần
const authMiddleware = require("../middleware/authmiddleware"); // Sử dụng middleware xác thực nếu cần

// Lấy danh sách sản phẩm trong giỏ hàng
router.get('/cart/:userId', getCart);

// Cập nhật giỏ hàng
router.put('/cart/:userId', updateCart);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/cart/:userId/item/:productId', removeItemFromCart);

// Xóa toàn bộ giỏ hàng
router.delete('/cart/:userId', clearCart);

module.exports = router;
