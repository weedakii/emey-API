import app from "./app.js";
import connectdb from "./config/db.js";
import dotenv from 'dotenv'

process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('shutting down server due to uncaught Exception');
    process.exit(1);
})
// settent confing and connect database
if(process.env.NODE_ENV !== 'PRODUCTION'){
    dotenv.config({path: 'backend/config/config.env'})
}
connectdb()

let port = process.env.PORT || 4000

const server = app.listen(port, () => {
    console.log(`server started at host: ${port} in ${process.env.NODE_ENV} mode`);
})
// handle unhandled promis error
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('shutting down server due to unhandled rejection');
    server.close(() => {
        process.exit(1)
    });
})