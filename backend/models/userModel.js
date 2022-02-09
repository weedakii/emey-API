import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import validator from 'validator'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'plz enter your name'],
        maxLength: [30, 'your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'plz enter your email'],
        unique: true,
        validators: [validator.isEmail, 'plz enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'plz enter your password'],
        minLength: [6, 'your password cannot be lessthan 6 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAT: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: false,
    resetPasswordExpire: Date
})
// becrypt the password before saving
userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})
// compare password 
userSchema.methods.comparePassword = async function (pass){
    return await bcrypt.compare(pass, this.password)
}
// return jwt email information
userSchema.methods.getJwtToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATES
    })
}
// generate password reset token
userSchema.methods.getResetPasswordToken = function (){
    // generate token
    const resetToken = crypto.randomBytes(20).toString('hex')
    // hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // set token expire time
    this.resetPasswordExpire = Date.now()+30*60*1000
    return resetToken
}


export default mongoose.model('User', userSchema)