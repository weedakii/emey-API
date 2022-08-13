import mongoose from 'mongoose'

const favouriteSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    info: {
        type: String,
        required: true,
    },
    images: Array,
    category: {
        type: String,
        required: true,
    },
    reviews: Array,
    price: {
        type: Number,
        required: true,
    },
    oldPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    ratings: {
        type: Number,
        required: true,
    },
    seller: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true, 
    },
    numOfReviews: {
        type: Number,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAT: {
        type: Date,
        required: true,
    },
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    addedAT: {
        type: Date,
        default: Date.now
    }
})


export default mongoose.model('Favourite', favouriteSchema)