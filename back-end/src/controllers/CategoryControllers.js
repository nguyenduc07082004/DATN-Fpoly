const Cart = require('../models/CartModels');
const Product = require('../models/ProductModels');  // Dùng để kiểm tra tồn tại sản phẩm trong giỏ
const mongoose = require('mongoose');

// Lấy giỏ hàng của người dùng
exports.getCart = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId }).populate('items.productId', 'title price imageURL'); // Populate thông tin sản phẩm
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại.' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error });
  }
};

// Cập nhật giỏ hàng
exports.updateCart = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params
  const { items } = req.body;   // Lấy danh sách các sản phẩm cần cập nhật từ body

  try {
    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng cho người dùng
      cart = new Cart({ userId, items });
      await cart.save();
      return res.status(201).json({ message: 'Giỏ hàng đã được tạo mới.', cart });
    }

    // Duyệt qua các sản phẩm trong giỏ hàng
    for (let item of items) {
      const { productId, quantity } = item;

      // Kiểm tra xem sản phẩm có trong giỏ hàng chưa
      const existingItemIndex = cart.items.findIndex(i => i.productId.toString() === productId.toString());

      if (existingItemIndex >= 0) {
        // Nếu có, cập nhật số lượng
        cart.items[existingItemIndex].quantity = quantity;
      } else {
        // Nếu không có, thêm sản phẩm vào giỏ hàng
        cart.items.push(item);
      }
    }

    // Lưu lại giỏ hàng đã cập nhật
    await cart.save();
    res.status(200).json({ message: 'Giỏ hàng đã được cập nhật.', cart });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng.', error });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeItemFromCart = async (req, res) => {
  const { userId, productId } = req.params; // Lấy userId và productId từ params

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại.' });
    }

    // Tìm và xóa sản phẩm khỏi giỏ hàng
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng.' });
    }

    cart.items.splice(itemIndex, 1); // Xóa sản phẩm tại vị trí itemIndex
    await cart.save();

    res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng.', cart });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng.', error });
  }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params

  try {
    // Tìm và xóa giỏ hàng của người dùng
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại.' });
    }

    res.status(200).json({ message: 'Giỏ hàng đã được xóa.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng.', error });
  }
};