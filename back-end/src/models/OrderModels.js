import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["Pending", "Confirmed", "In Delivery", "Delivered", "Success" , "Cancelled"], required: true },
  total_price: { type: Number, required: true },  
  receiver_name: { type: String, required: true },
  receiver_phone: { type: String, required: true },
  receiver_address: { type: String, required: true },
  voucher: {type : String, required: false},
  discount_value: {type: Number, required: false},
  payment_status: { type: String, enum: ["unpaid", "paid"], required: true },
  items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  delivered_at: { type: Date, default: null },
});

export default model("Order", orderSchema);
