const mongoose= require ('mongoose');

const categorySchema= new mongoose.Schema(

    {
        name:{type: String , require: true}
    }
);
const Category = mongoose.model('Categories',categorySchema);

module.exports=Category;