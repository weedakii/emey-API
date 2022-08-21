import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: [true, 'plz enter product name'],
        trim: true,
        maxlength: [100, 'plz make sure that the lenth is maximum 100 character']
    },
    info: {
        type: String,
        required: [true, 'plz enter product info'],
    },
    type: {
        type: String,
        required: true,
        default: 'original'
    },
    oldPrice: {
        type: Number,
        maxlength: [5, 'plz make sure that the lenth is maximum 5 numbers'],
    },
    discount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'plz enter product price'],
        maxlength: [5, 'plz make sure that the lenth is maximum 5 numbers'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'plz enter product description'],
    },
    ratings: {
        type: Number,
        default: 0.0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category: {
        type: String,
        required: [true, 'plz select product category'],
        enum: {
            values: [
                'ملابس حريمي',
                'ملابس رجالي',
                'ملابس اطفال',
                'مكن حلاقة',
                'عناية شخصية',
                'اكسسوارات',
                'اكسسوارات موبايل',
                'اكسسوارات كمبيوتر',
                'مستلزمات اطفال',
                'مستلزمات البيت',
            ],
            message: 'plz select corect category'
        }
    },
    seller: {
        type: String,
        required: [true, 'plz enter product seller'],
    },
    stock: {
        type: Number,
        required: [true, 'plz enter product stock'],
        maxlength: [5, 'product stock cannot have over 5'],
        default: 0.0
    },
    numOfReviews: {
        type: Number,
        default: 0.0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAT: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Product', productSchema)