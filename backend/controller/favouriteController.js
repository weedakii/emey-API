import ErrorHandler from '../utils/errHandler.js'
import catchAsyncErr from '../middlewares/catchAsyncErr.js'
import Favourites from '../models/favouriteModel.js'

// get all favourites
export const getAllFavourite = catchAsyncErr(async (req, res, next) => {
    const favourites = await Favourites.find({user: req.user.id})

    res.status(200).json({
        success: true,
        favourites
    })
})

// add to favourite
export const createFavourite = catchAsyncErr(async (req, res, next) => {
    const isFound = await Favourites.findOne({user: req.user.id, product: req.body.product})
    if (isFound) {
        return next(new ErrorHandler('Product is Already In', 401))
    }
    
    req.body.user = req.user.id
    const favourite = await Favourites.create(req.body)

    res.status(200).json({
        success: true,
        favourite
    })
})

//delete from favourite
export const deleteFavourite = catchAsyncErr(async (req, res, next) => {
    const fav = await Favourites.findOne({user: req.user.id, product: req.params.id})
    
    if (!fav) {
        return next(new ErrorHandler("item not found", 404))
    }

    await fav.remove()

    res.status(200).json({
        success: true,
        message: 'product removed successfuly'
    })
})