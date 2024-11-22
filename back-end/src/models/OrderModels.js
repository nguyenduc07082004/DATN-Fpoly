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

const orderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], required: true },
  total_price: { type: Number, required: true },
  receiver_name: { type: String, required: true },
  receiver_phone: { type: String, required: true },
  receiver_address: { type: String, required: true },
  payment_status: { type: String, enum: ["unpaid", "paid"], required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model("Order", orderSchema);
