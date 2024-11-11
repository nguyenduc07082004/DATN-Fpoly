// models/Order.js
// import { Schema, model } from "mongoose";

// const orderSchema = new Schema({
//   userId: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "User", // Liên kết với người dùng
//       required: true,
//     },
//   ],
//   items: [
//     {
//       product: {
//         type: Schema.Types.ObjectId,
//         ref: "Product", // Liên kết với sản phẩm
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],
//   totalPrice: {
//     type: Number,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["Pending", "In Delivery", "Delivered", "Cancelled"],
//     default: "Đang chuẩn bị hàng", // Trạng thái đơn hàng
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Xuất khẩu mặc định đối tượng Order
// export default model("Order", orderSchema);

import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    totalPrice: Number,
    status: {
      type: String,
      enum: ["Pending", "In Delivery", "Delivered", "Cancelled"],
      default: "Pending", // Trạng thái đơn hàng
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Order", orderSchema);
