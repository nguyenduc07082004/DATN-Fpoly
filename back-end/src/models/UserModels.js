const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username:{type:String,require:true},
  email:{type:String,require:true},
  password:{type:String,require:true},
  fullname:{ type: String, require: true },
  age: { type: Number, require: true },
  address: { type: String, require: true },
  phone: { type: Number, require: true },
  role:{type:String,default:"user"},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
