import 'dotenv/config';
import mongoose from 'mongoose';
import ProductModel from './models/Products.js'; 


// New Data
const products = [
    {
        name: "Samsung Galaxy S24",
        price: 75000,
        qty: 10,
        desc: "Ultra HD Camera",
        image: "THUMB_Galaxy_S23_MA_Thumb_1440x960.jpg"
    },
    {
        name: "Nike Shoes",
        price: 5000,
        qty: 5,
        desc: "Running Shoes",
        image: "pexels-melvin-buezo-1253763-2529157.jpg"
    },{
    
        name: " Apple Iphone",
        price: 120000,
        qty:10,
        desc: "Iphone",
        image:"igor-omilaev-24HAK_jRRvQ-unsplash.jpg",

    },{
        name:"Dell Laptop",
        price:90000,
        qty:7,
        desc:"Laptop",
        specification:"16Gb Ram, 512Gb SSD, i7 ",
        image:"laptop-dell-db14250-copilot-pc-mg.avif"
    }

];
   const DB_URI = process.env.MONGO_URL;

const seedDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(" Database Connected!");

        // deleteMany({})
        await ProductModel.deleteMany({}); 
        console.log(" Purana Data Delete Ho Gaya!");

        // New Data Add
        await ProductModel.insertMany(products);
        console.log(" Sirf Naya Data Add Hua Hai!");

        mongoose.connection.close();
    } catch (err) {
        console.log(" Error:", err);
    }
};

seedDB();