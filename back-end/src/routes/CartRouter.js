const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartControllers"); // Thay đổi đường dẫn nếu cần // Sử dụng middleware xác thực nếu cần

// Lấy danh sách sản phẩm trong giỏ hàng
router.get("/", cartController.getCartItems);

// Thêm sản phẩm vào giỏ hàng
router.post("/add", cartController.addCartItem);

// Cập nhật sản phẩm trong giỏ hàng
router.put("/:id", cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/:id", cartController.deleteCartItem);

module.exports = router;
