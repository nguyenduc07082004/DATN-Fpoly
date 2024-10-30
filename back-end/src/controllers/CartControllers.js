// controllers/cartController.js
const Cart = require("../models/CartModels");

async function addToCart(req, res) {
  try {
    const { userId, productId, quantity } = req.body;
    const newCartItem = new Cart({ userId, productId, quantity });
    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm sản phẩm vào giỏ hàng", error });
  }
}

async function getAllCartItems(req, res) {
  try {
    const cartItems = await Cart.find()
      .populate('userId', 'username email')
      .populate('productId', 'title price');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu giỏ hàng", error });
  }
}

async function updateCartItem(req, res) {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    if (!cartItem) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm trong giỏ hàng", error });
  }
}

async function deleteCartItem(req, res) {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }
    res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm trong giỏ hàng", error });
  }
}

module.exports = { addToCart, getAllCartItems, updateCartItem, deleteCartItem };
