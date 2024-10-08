const mongoose= require ('mongoose');

const productSchema= new mongoose.Schema(

    {
        title: { type: String , require: true},
        price: { type: Number , require: true},
        imageURL: { type: String , require: true},
        categories: { type: mongoose.Schema.Types.ObjectId ,ref: 'Categories', require: true}
    }
);
const Product = mongoose.model('Product',productSchema);

module.exports=Product;