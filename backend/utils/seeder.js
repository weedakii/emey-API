import connectDB from '../config/db.js'
import products from '../data/products.json'
import Product from '../models/productModel.js'
import dotenv from "dotenv";

dotenv.config({path: 'backend/config/config.env'})
connectDB()

const seedProducts = async () => {
    try {
        await Product.deleteMany()
        console.log('products deleted successfly');
        
        await Product.insertMany(products)
        console.log('products inseted successfly');

        process.exit()
    } catch (err) {
        console.log(err.message);
        console.log(err.stack);
        process.exit()
    }
}

seedProducts()