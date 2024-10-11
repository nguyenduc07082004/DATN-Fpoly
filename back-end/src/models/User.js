const mongoose= require('mongoose');

const loginSchema = new mongoose.Schema(
    {
        username:{type:String,require:true},
        email:{type:String,require:true},
        password:{type:String,require:true},
        role:{type:String,default:"user"}
    }
)
const Login=mongoose.model('Login',loginSchema);
module.exports=Login;