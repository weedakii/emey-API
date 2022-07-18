import User from '../models/userModel.js'
import ErrHandler from '../utils/errHandler.js'
import catchAsyncErr from '../middlewares/catchAsyncErr.js'
import sendToken from '../utils/jwtToken.js'
import sendEmail from '../utils/sendEmail.js'
import crypto from 'crypto'
import cloudinary from "cloudinary"
import {OAuth2Client}from 'google-auth-library';
import mailgun from "mailgun-js";
// const DOMAIN = 'sandboxc415a02114654f71bf53e6871f61bc0e.mailgun.org';
// const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});
const client = new OAuth2Client("14928484089-aq5ckopm9jf0eu8ricjapu1nin9fdami.apps.googleusercontent.com")


// register
export const registerUser = catchAsyncErr(async (req, res, next) => {
    const { name, email, password } = req.body

    const user = await User.create({ 
        name,
        email, 
        password,
        avatar: {
            public_id: 'avatar/user_umrxh3',
            url: 'https://res.cloudinary.com/weedakii/image/upload/v1640540356/avatar/user_umrxh3.jpg'
        }
    })

    sendToken(user, 200, res)
})
// login
export const loginUser = catchAsyncErr(async (req, res, next) => {
    const { email, password } = req.body
    // check if user intered the email and password
    if (!email || !password) {
        return next(new ErrHandler('plz inter your email and password', 400));
    }
    // check if user is already has an email
    const user = await User.findOne({email}).select('+password')
    if (!user) {
        return next(new ErrHandler('Invalid email', 401));
    }
    // check if password is correct
    const isPassword = await user.comparePassword(password)
    if (!isPassword) {
        return next(new ErrHandler('Invalid password', 401));
    }
    sendToken(user, 200, res)
})
// login with google
export const googleLogin = catchAsyncErr(async (req, res, next) => {
    const {tokenId} = req.body
    
    client.verifyIdToken({
        idToken: tokenId, 
        audience: "14928484089-aq5ckopm9jf0eu8ricjapu1nin9fdami.apps.googleusercontent.com"
    }).then(response => {
        const {email_verified, name, email, picture} = response.payload
        if (email_verified) {
            User.findOne({email}).exec(async (err, user) => {
                if (err) {
                    return next(new ErrorHandler('Something went wronge...', 400))
                } else {
                    if (user) {
                        console.log("555");
                        sendToken(user, 200, res)
                    } else {
                        console.log("444");
                        const myCloud = await cloudinary.v2.uploader.upload(picture, {
                            folder: 'avatar',
                            with: 150,
                            crop: "scale",
                        })
                        let password = email
                        let newUser = new User({
                            name,
                            email,
                            password,
                            avatar: {
                                public_id: myCloud.public_id,
                                url: myCloud.secure_url
                            }
                        });
                        newUser.save()
                        console.log(newUser);
                        sendToken(newUser, 201, res)
                    }
                }
            })
        }
    })
})
// forgot password
// export const forgotPassword = catchAsyncErr(async (req, res, next) => {
//     const user = await User.findOne({ email: req.body.email })
//     if (!user) {
//         return next(new ErrorHandler('User not found with this email', 404))
//     }

//     const resetToken = user.getResetPasswordToken()
//     await user.save({ validateBeforeSave: false })
//     const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
//     const message = `Your password reset token is as follow:<br><br>(<a href='${resetUrl}'>${resetUrl}</a>)<br><br>If you have not requested this email, then ignore it`;

//     const data = {
//         from: 'Tsouq <reactweed@gmail.com>',
//         to: user.email,
//         subject: 'Tsouq password recovery',
//         html: message
//     };

//     try {
//         mg.messages().send(data, function (error, body) {
//             console.log(body);
//         });

//         res.status(200).json({
//             success: true,
//             message: `Email send to: ${user.email}`
//         })
//     } catch (error) {
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;

//         await user.save({ validateBeforeSave: false })

//         return next(new ErrorHandler(error.message, 500))
//     }
// })
// // reset password
// export const resetPassword = catchAsyncErr(async (req, res, next) => {
//     const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

//     const user = await User.findOne({
//         resetPasswordToken,
//         resetPasswordExpire: { $gt: Date.now() }
//     })

//     if (!user) {
//         return next(new ErrHandler('password reset token is invalid or has been expired', 400))
//     }

//     if (req.body.password !== req.body.confirmPassword) {
//         return next(new ErrHandler('password does not match confirm password', 400))
//     }

//     user.password = req.body.password
//     user.resetPasswordToken = undefined
//     user.resetPasswordExpire = undefined

//     await user.save()

//     sendToken(user, 200, res)
// })
// get currently logged in user details
export const getUserProfile = catchAsyncErr(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})
// update or chanche password
export const updatePassword = catchAsyncErr(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')
    // check user previous password
    const isPassword = await user.comparePassword(req.body.oldPassword)
    if (!isPassword){
        return next(new ErrHandler('old password is incorrect', 400))
    }
    if (req.body.oldPassword === req.body.password){
        return next(new ErrHandler('this is the same as the old password', 400))
    }

    user.password = req.body.password
    await user.save()
    sendToken(user, 200, res)
})
// update user profile
export const updateProfile = catchAsyncErr(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        address: req.body.address,
    }

    if (req.body.avatar !== '') {
        const us = await User.findById(req.user.id)
        const imgId = us.avatar.public_id

        await cloudinary.v2.uploader.destroy(imgId)
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatar',
            with: 150,
            crop: "scale",
        })
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})
// logout
export const logout = catchAsyncErr(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: 'logout successfly'
    })
})
// admin routes

// get all users
export const allUser = catchAsyncErr(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        count: users.length,
        users
    })
})
// get all users
export const getSingleUser = catchAsyncErr(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user){
        return next(new ErrHandler(`user with id: ${req.params.id} not found`, 400))
    }

    res.status(200).json({
        success: true,
        user
    })
})
// updata User
export const updateUser = catchAsyncErr(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})
// delete user
export const deleteUser = catchAsyncErr(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user){
        return next(new ErrHandler(`user with id: ${req.params.id} not found`, 400))
    }

    await user.remove()

    res.status(200).json({
        success: true,
        message: 'user removed'
    })
})