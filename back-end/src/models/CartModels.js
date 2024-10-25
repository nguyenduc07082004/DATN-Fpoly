const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Tham chiếu đến người dùng
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Tham chiếu đến sản phẩm
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1, // Số lượng mặc định là 1
      },
     
    },
  ],

}, { timestamps: true }); // timestamps: tự động thêm createdAt và updatedAt

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
