import { Schema, model } from "mongoose";

const orderItemSchema = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },  
  variantId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  storage: { type: String, required: true },
  color: { type: String, required: true },   
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model("OrderItem", orderItemSchema);
