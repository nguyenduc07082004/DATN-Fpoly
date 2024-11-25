import { Schema, model } from "mongoose";

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  dob: { type: Date },
  role: { type: String, enum: ["user", "admin"], required: true, default: "user" },
  is_active: { type: Boolean, default: false },
  profile_picture: { type: String }, 
  is_blocked: { type: Boolean, default: false }, 
  email_verified: { type: Boolean, default: false },
  last_login: { type: Date }, 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

userSchema.set('timestamps', true); 



export default model("User", userSchema);
