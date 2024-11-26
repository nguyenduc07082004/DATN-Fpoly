import { Schema, model } from "mongoose";

// Schema cho Cart
const cartSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },  
      variantId: { type: String },  
      quantity: { type: Number, required: true },  
      price: { type: Number, required: true },  
      storage: { type: String },  
      color: { type: String },  
    }
  ],
  status: { type: String, enum: ["active", "ordered"], default: "active" },
  total_price: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model("Cart", cartSchema);
