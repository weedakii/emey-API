import Product from '../models/productModel.js'
import ErrHandler from '../utils/errHandler.js'
import catchAsyncErr from '../middlewares/catchAsyncErr.js'
import APIFeatures from '../utils/APIFeatures.js'

// get all products
export const getAllProducts = catchAsyncErr(async (req, res, next) => {
    const resPerPage = 4;
    const productCount = await Product.countDocuments()

    const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search().filter().pagination(resPerPage);

    const products = await apiFeatures.query

    res.status(200).json({
        success: true,
        message: 'all products will be here',
        productCount,
        count: products.length,
        products
    })
})
// get single product
export const getSingleProduct = catchAsyncErr(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrHandler('Product not found', 404))
    }

    res.status(200).json({
        success: true,
        product
    })
})
// create new product
export const createProduct = catchAsyncErr(async (req, res, next) => {
    
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: product
    })
})
// update product
export const updateProduct = catchAsyncErr(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    
    if (!product) {
        return next(new ErrHandler('Product not found', 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})
// delete product
export const deleteProduct = catchAsyncErr(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrHandler('Product not found', 404))
    }

    product.remove()

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    })
})
// create new review
export const createReview = catchAsyncErr(async (req, res, next) => {
    const { rating, comment, productId } = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(r => {
            if (r.user.toString() === req.user._id.toString()) {
                r.comment = comment
                r.rating = rating
            }
        })
    } else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
        console.log('weed');
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        product
    })
})
// get product review
export const getProductReview = catchAsyncErr(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    
    if(!product){
        return next(new Error('Product not found', 400));
    }
    const reviews = product.reviews

    res.status(200).json({
        success: true,
        reviews
    })
})
// delete product review
export const deleteProductReview = catchAsyncErr(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())
    const numOfReviews = reviews.length
    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    } , {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    
    res.status(200).json({
        success: true,
        product
    })
})