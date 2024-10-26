const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, require: true },
  note: { type: String },
});
const Category = mongoose.model("categories", categorySchema);

module.exports = Category;
