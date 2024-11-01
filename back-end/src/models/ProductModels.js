const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, require: true },
  price: { type: Number, require: true },
  storage: { type: String },
  color: { type: String },
  image: { type: String },
  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    require: true,
  },
  quantity: { type: Number, require: true },
  description: { type: String },
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
