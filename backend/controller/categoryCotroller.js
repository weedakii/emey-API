import Carusel from '../models/carosalModel.js'
import catchAsyncErr from "../middlewares/catchAsyncErr.js"
import ErrorHandler from "../utils/errHandler.js"
// get Category
export const getCategory = catchAsyncErr(async (req, res, next) => {
    const category = [
        "weed",
        "Labtop",
        "Ladies",
        "Shoes",
        "Clothes",
        "Watches",
        "Electronics",
        "Forneture"
    ]

    res.status(200).json({
        success: true,
        category
    })
})
// get carousel
export const getCarousel = catchAsyncErr(async (req, res, next) => {
    const carusel = await Carusel.find()

    res.status(200).json({
        success: true,
        carusel
    })
})
// create carousel
export const createCarousel = catchAsyncErr(async (req, res, next) => {
    let carousel = await Carusel.create(req.body)

    res.status(200).json({
        success: true,
        carousel
    })
})
// update carousel
export const updateCarousel = catchAsyncErr(async (req, res, next) => {
    let carousel = await Carusel.findById(req.params.id)

    if (!carousel) {
        return next(new ErrorHandler("Product not found", 404))
    }

    carousel = await Carusel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        carousel
    })
})

