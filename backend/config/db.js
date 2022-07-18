import mongoose from "mongoose";
import dotenv from "dotenv";

if(process.env.NODE_ENV !== 'PRODUCTION'){
    dotenv.config({path: 'backend/config/config.env'})
}

const connectdb = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(res => {
        console.log(`mongodb database started at host: ${res.connection.host}`);
    })
}

export default connectdb