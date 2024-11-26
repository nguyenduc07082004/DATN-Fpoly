import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  totalPrice: Number,
  bankCode: String,
  status: {
    type: String,
    enum: ["Pending", "In Delivery", "Delivered", "Cancelled"],
    default: "Pending", // Trạng thái đơn hàng
  },
});

export default model("Order", orderSchema);
