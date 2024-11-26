import { Schema, model } from "mongoose";

const brandSchema = new Schema({
  name: { type: String, required: true },
  logo_url: { type: String },
  status: { type: String, enum: ["active", "inactive"], required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model("Brand", brandSchema);
