import { Schema, model } from "mongoose";

const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  storage: { type: String },
  color: { type: String },
  image: { type: String },
  categories: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  quantity: { type: Number, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model("Product", productSchema);
