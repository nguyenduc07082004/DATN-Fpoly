const Cart = require("../models/CartModels");
const Product = require("../models/ProductModels");

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // Giả sử bạn có userId từ middleware xác thực

    // Kiểm tra nếu giỏ hàng của người dùng đã tồn tại
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Tìm kiếm sản phẩm trong giỏ hàng
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Nếu sản phẩm chưa có, thêm vào giỏ hàng
        cart.items.push({ productId, quantity });
      }
    } else {
      // Nếu giỏ hàng chưa tồn tại, tạo giỏ hàng mới cho người dùng
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy giỏ hàng của người dùng
exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Giỏ hàng không tồn tại" });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Giỏ hàng không tồn tại" });

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Sản phẩm không có trong giỏ hàng" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Giỏ hàng không tồn tại" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
