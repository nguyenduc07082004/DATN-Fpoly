const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Nếu bạn có mô hình người dùng
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product' // Nếu bạn có mô hình sản phẩm
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }]
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
