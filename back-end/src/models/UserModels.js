
const mongoose= require ('mongoose');

const userSchema= new mongoose.Schema(

    {
       name : {type:String,require:true},
       age :{type:Number,require:true},
        address :{type :String,require:true},
        email:{type: mongoose.Schema.Types.ObjectId ,ref: 'Login', require: true},
        sdt:{type:Number,require:true},
        role:{ type: mongoose.Schema.Types.ObjectId ,ref: 'Login', require: true}
        
    }
);
 
const User=mongoose.model('User',userSchema);;

module.exports=User;