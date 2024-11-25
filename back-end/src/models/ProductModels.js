import { Schema, model } from "mongoose";

const variantSchema = new Schema({
  sku: { type: String, required: true, unique: true },
  color: {
    type: String,
    enum: ["Đen", "Trắng", "Hồng", "Xanh"],
  },
  storage: {
    type: String,
    enum: ["128GB", "256GB", "512GB", "1TB"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"], 
  },
  quantity: {
    type: Number,
    required: true,
    min:[0, "Quantity cannot be negative"],
  },
});

const productSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String },
  categories: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String },
  variants: [variantSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Xuất mô hình Product
export default model("Product", productSchema);
