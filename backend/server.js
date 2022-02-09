import app from "./app.js";
import connectdb from "./config/db.js";
import dotenv from "dotenv";

process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('shutting down server due to uncaught Exception');
    server.close(() => {
        process.exit(1);
    });
})
// settent confing and connect database
dotenv.config({path: 'backend/config/config.env'})
connectdb()

const server = app.listen(5000, () => {
    console.log(`server started at host: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})
// handle unhandled promis error
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('shutting down server due to unhandled rejection');
    server.close(() => {
        process.exit(1)
    });
})