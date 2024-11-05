import { Schema, model } from "mongoose";

const productSchema = new Schema({
  title: { type: String, require: true },
  price: { type: Number, require: true },
  storage: { type: String },
  color: { type: String },
  image: { type: String },
  categories: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    require: true,
  },
  quantity: { type: Number, require: true },
  description: { type: String },
});
export default model("Product", productSchema);
