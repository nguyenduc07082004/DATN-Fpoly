import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["Pending", "In Delivery", "Delivered", "Cancelled"], required: true },
  total_price: { type: Number, required: true },  
  receiver_name: { type: String, required: true },
  receiver_phone: { type: String, required: true },
  receiver_address: { type: String, required: true },
  payment_status: { type: String, enum: ["unpaid", "paid"], required: true },
  items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model("Order", orderSchema);
