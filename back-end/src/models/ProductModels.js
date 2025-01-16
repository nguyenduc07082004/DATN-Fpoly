import { Schema, model } from "mongoose";

const variantSchema = new Schema({
  sku: { type: String, unique: true, sparse: true }, 
  color: {
    type: String,
    enum: ["Đen", "Trắng", "Hồng", "Xanh" , "Đỏ" , "Vàng" , "XanhLá" , "Bạc"],
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
    variantImages: [{ type: Schema.Types.ObjectId, ref: "VariantImage" }],
    deleted_at: { type: Date, default: null },
});

const productSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String },
  categories: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String },
  default_price: { type: Number, required: true },
  variants: { type: [variantSchema], default: [] }, 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

// Xuất mô hình Product
export default model("Product", productSchema);
