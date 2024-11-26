import { Schema, model } from "mongoose";

const userTokenSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  type: { type: String, enum: ["auth", "password_reset"], required: true },
  expired_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
});

export default model("UserToken", userTokenSchema);
