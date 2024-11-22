import { Schema, model } from "mongoose";

const bannerSchema = new Schema({
  image_url: { type: String, required: true },
  link: { type: String },
  status: { type: String, enum: ["active", "inactive"], required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model("Banner", bannerSchema);
