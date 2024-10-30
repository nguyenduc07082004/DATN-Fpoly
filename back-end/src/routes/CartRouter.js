const express = require("express");
const router = express.Router();
const {
    addToCart,
    getAllCartItems,
    updateCartItem,
    deleteCartItem,
  } = require("../controllers/CartControllers");
// Lấy danh sách sản phẩm trong giỏ hàng
router.get("/", getAllCartItems);

// Thêm sản phẩm vào giỏ hàng
router.post("/add", addToCart);

// Cập nhật sản phẩm trong giỏ hàng
router.put("/:id", updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/:id", deleteCartItem);

module.exports = router;
