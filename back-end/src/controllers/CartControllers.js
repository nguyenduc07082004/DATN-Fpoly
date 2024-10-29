const Cart = require("../models/CartModels"); // Thay đổi đường dẫn nếu cần

// Lấy danh sách sản phẩm trong giỏ hàng
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find(); // Lấy tất cả sản phẩm trong giỏ
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra!", error });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addCartItem = async (req, res) => {
  const newItem = new Cart(req.body);
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: "Không thể thêm sản phẩm vào giỏ!", error });
  }
};

// Cập nhật sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
  try {
    const updatedItem = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Không thể cập nhật sản phẩm!", error });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.deleteCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng!" });
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra khi xóa sản phẩm!", error });
  }
};
