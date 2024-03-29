import ErrorHandler from "../utils/errHandler.js";
import dotenv from 'dotenv'

if(process.env.NODE_ENV !== 'production'){
    dotenv.config({path: 'backend/config/config.env'})
}

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    

    if (process.env.NODE_ENV === 'developement') {
        res.status(err.statusCode).json({
            success: false,
            error: err, 
            errMessage: err.message,
            stack: err.stack
        })
    }

    if (process.env.NODE_ENV === 'production') {
        let error = {...err}
        error.message = err.message
        // Wrong mongoose object id error
        if(err.name === 'CastError'){
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }
        // mongoose validation error
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(v => v.message)
            error = new ErrorHandler(message, 400)
        }
        // handling mongoose duplicate keys errors
        if(err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }
        // handling wrong jwt errors
        if(err.name === 'JsonWebTokenError') {
            const message = `JSON wep token is invalid. try again`
            error = new ErrorHandler(message, 400)
        }
        // handling expires jwt errors
        if(err.name === 'TokenExpiredError') {
            const message = `JSON wep token is expired. try again`
            error = new ErrorHandler(message, 400)
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })
    }
}
