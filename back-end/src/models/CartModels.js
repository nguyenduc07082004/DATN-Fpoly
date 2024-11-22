import { Schema, model } from "mongoose";
const cartSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true }, 
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  status: { type: String, enum: ["active", "ordered"], default: "active" },
  total_price: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model("Cart", cartSchema);
