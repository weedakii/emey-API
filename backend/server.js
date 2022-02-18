import app from "./app.js";
import connectdb from "./config/db.js";

process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('shutting down server due to uncaught Exception');
    process.exit(1);
})
// settent confing and connect database
if(process.env.NODE_ENV !== 'PRODUCTION'){
    require('dotenv').config({path: 'backend/config/config.env'})
}
connectdb()


const server = app.listen(process.env.PORT, () => {
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