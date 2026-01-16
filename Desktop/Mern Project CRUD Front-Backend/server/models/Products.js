import mongoose from "mongoose";
const ProductsSchema = new mongoose.Schema({
     
    name: String,
    price: Number, 
    desc: String,
    image: String,
    qty: Number,
    specification: String,

})
const ProductModel = mongoose.model("products" , ProductsSchema)

export default ProductModel;
