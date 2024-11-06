// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Liên kết với người dùng
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Liên kết với sản phẩm
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Pending", // Trạng thái đơn hàng
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Xuất khẩu mặc định đối tượng Order
export default mongoose.model("Order", orderSchema);
