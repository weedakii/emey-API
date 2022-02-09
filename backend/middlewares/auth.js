import ErrHandler from '../utils/errHandler.js'
import catchAsyncErr from './catchAsyncErr.js'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
// check if user is authenticated
export const isAuthenticated = catchAsyncErr(async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return next(new ErrHandler('login first to access this resourse', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
})
// users roles
export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrHandler(`Role (${req.user.role}) is not allowed to access this resourse`, 403))
        }
        next()
    }
}