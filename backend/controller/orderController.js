import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import ErrHandler from '../utils/errHandler.js'
import catchAsyncErr from '../middlewares/catchAsyncErr.js'

// create new order
export const createOrder = catchAsyncErr(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
})
// get single order
export const getOrder = catchAsyncErr(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrHandler('no order found with id', 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})
// get my order
export const myOrders = catchAsyncErr(async (req, res, next) => {
    const order = await Order.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        order
    })
})
// get all order
export const allOrders = catchAsyncErr(async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0;
    orders.forEach((order) => totalAmount += order.totalPrice)
    
    res.status(200).json({
        success: true,
        coutn: orders.length,
        totalAmount,
        orders
    })
})
// update status order
export const updateOrder = catchAsyncErr(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrHandler('no order found with id', 404))
    }
    if (order.orderStatus === 'Deliverde'){
        return next(new ErrHandler('you have already delivered this order', 400))
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()

    await order.save()

    res.status(200).json({
        success: true,
        order
    })
})
async function updateStock(id, quantity){
    const product = await Product.findById(id)

    product.stock = product.stock - quantity

    await product.save({ validateBeforeSave: false }) 

}
// delete order
export const deleteOrder = catchAsyncErr(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrHandler('no order found with id', 404))
    }

    await order.remove()

    res.status(200).json({
        success: true,
        message: 'order deleted successfly'
    })
})