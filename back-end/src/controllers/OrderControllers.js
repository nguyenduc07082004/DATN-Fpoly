// controllers/orderController.js
import Order from "../models/OrderModels.js";
import Cart from "../models/CartModels.js";
import Product from "../models/ProductModels.js";
import User from "../models/UserModels.js";

export const checkout = async (req, res, next) => {
  try {
    const userId = req.user._id; // Lấy thông tin người dùng từ token
    const cart = await Cart.findOne({ userId }).populate("items.product");

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
      status: "Pending", // Trạng thái mặc định khi đơn hàng mới được tạo
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

export const getOrderDetail = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const userId = req.user._id;

  try {
    const order = await Order.find({ userId })
      .populate("items.product")
      .populate("userId");
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(500).json({ message: "Error getting order details", error });
  }
};

// Hàm cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // Trạng thái mới cần cập nhật

  // Danh sách trạng thái hợp lệ
  const validStatuses = [
    "Đang chuẩn bị hàng",
    "Đang giao hàng",
    "Giao hàng thành công",
    "Đơn hàng đã bị hủy",
  ];

  // Kiểm tra trạng thái mới có hợp lệ không
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Trạng thái không hợp lệ",
      validStatuses,
    });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Cập nhật trạng thái đơn hàng
    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error });
  }
};
