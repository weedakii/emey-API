import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import router from "./routes/routes.js";
import error from './middlewares/error.js'
const app = express();
app.use(express.json())
app.use(cookieParser())

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: 'backend/config/config.env'})
}

app.use('/api/v1', router)

app.use(express.static(path.join('__dirname', '../frontend/build')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve('__dirname', '../frontend/build/index.html'))
})

app.use(error)

export default app