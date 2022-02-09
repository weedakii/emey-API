import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import router from "./routes/routes.js";
import error from './middlewares/error.js'
const app = express();
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1', router)
if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join('__dirname', '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.join('__dirname', '../frontend', 'build','index.html' ))
    })
} else {
    app.get('/', (req, res) => {
        res.send('api rinning');
    })
}
app.use(error)

export default app