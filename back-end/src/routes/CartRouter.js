const express = require("express");
const cartController = require("../controllers/CartControllers");
const { verifyToken } = require("../middleware/authMiddleware"); // Middleware xác thực người dùng

const router = express.Router();

// Thêm sản phẩm vào giỏ hàng
router.post("/add", verifyToken, cartController.addToCart);

// Lấy giỏ hàng của người dùng
router.get("/", verifyToken, cartController.getUserCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/update", verifyToken, cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/remove", verifyToken, cartController.removeCartItem);

module.exports = router;
