import ErrorHandler from '../utils/errHandler.js'
import catchAsyncErr from '../middlewares/catchAsyncErr.js'
import Favourites from '../models/favouriteModel.js'
import Products from "../models/productModel.js";


// get all favourites
export const getAllFavourite = catchAsyncErr(async (req, res, next) => {
    const favourites = await Favourites.find({by: req.user.id})

    res.status(200).json({
        success: true,
        favourites
    })
})

// add to favourite
export const createFavourite = catchAsyncErr(async (req, res, next) => {
    const isFound = await Favourites.findOne({by: req.user.id, product: req.body.product})
    if (isFound) {
        return next(new ErrorHandler('Product is Already In', 401))
    }
    
    const product = await Products.findById(req.body.product)
    if (!product) {
        return next(new ErrorHandler('Product Not found', 401))
    }
    let newProd = {by: req.user.id, product: req.body.product}
    newProd = {...product._doc, ...newProd}
    console.log(newProd);
    const favourite = await Favourites.create(newProd)

    res.status(200).json({
        success: true,
        favourite
    })
})

//delete from favourite
export const deleteFavourite = catchAsyncErr(async (req, res, next) => {
    const fav = await Favourites.findOne({by: req.user.id, product: req.params.id})
    
    if (!fav) {
        return next(new ErrorHandler("item not found", 404))
    }

    await fav.remove()

    res.status(200).json({
        success: true,
        message: 'product removed successfuly'
    })
})