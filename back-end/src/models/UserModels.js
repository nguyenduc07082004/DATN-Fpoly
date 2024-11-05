import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  fullName: { type: String, require: true },
  address: { type: String, require: true },
  phone: { type: Number, require: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

export default model("User", userSchema);

// npm install express mongoose bcryptjs jsonwebtoken
