import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  parent_id: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  image: { type: String , required: true },
  status: { type: String, enum: ["active", "inactive"], required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model("Category", categorySchema);
