import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: 'backend/config/config.env'})

const connectdb = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(res => {
        console.log(`mongodb database started at host: ${res.connection.host}`);
    }).catch(err => {
        console.log(`mongodb err: ${err}`);
    })
}

export default connectdb