import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, require: true },
  note: { type: String },
});
export default mongoose.model("Category", categorySchema);
