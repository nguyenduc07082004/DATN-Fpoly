// controllers/orderController.js
import Order from "../models/OrderModels.js";
import Cart from "../models/CartModels.js";
import Product from "../models/ProductModels.js";

// Xuất khẩu hàm trực tiếp khi khai báo
export const checkout = async (req, res, next) => {
  try {
    const userId = req.user._id; // Lấy thông tin người dùng từ token
    const cart = await Cart.findOne({ userId }).populate("products.product");

    if (!cart) {
      return res.status(400).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Tính tổng giá trị của đơn hàng
    const totalPrice = cart.products.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Tạo đơn hàng mới
    const order = new Order({
      userId,
      items: cart.products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice,
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await order.save();

    // Xóa giỏ hàng sau khi thanh toán
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      message: "Đặt hàng thành công",
      order,
    });
  } catch (error) {
    next(error);
  }
};
