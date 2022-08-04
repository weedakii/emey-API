import express from "express";
import { allUser, deleteUser, getSingleUser, getUserProfile, googleLogin, loginUser, logout, registerUser, updatePassword, updateProfile, updateUser } from "../controller/authController.js";
import { allOrders, createOrder, getOrder, myOrders, updateOrder, deleteOrder } from "../controller/orderController.js";
import { createProduct, createReview, deleteProduct, deleteProductReview, getAllProducts, getAllProductsForFlutter, getProductReview, getSingleProduct, homeProducts, updateProduct } from "../controller/productController.js";
import { authorizeRole, isAuthenticated } from "../middlewares/auth.js";
import { createCarousel, createCategory, getCarousel, getCategory, updateCarousel } from '../controller/categoryCotroller.js';
import { createFavourite, deleteFavourite, getAllFavourite } from '../controller/favouriteController.js';


const router = express.Router()
// category and carusel routes
router.route('/category').get(getCategory)
router.route('/category/new').post(createCategory)
router.route('/carousel').get(getCarousel)
router.route('/new/carousel').post(createCarousel)
router.route('/carousel/:id').put(updateCarousel)
// favourite routes
router.route('/favourite').get(isAuthenticated ,getAllFavourite)
router.route('/favourite/new').post(isAuthenticated ,createFavourite)
router.route('/favourite/:id').delete(isAuthenticated ,deleteFavourite)
// products
router.route('/home').get(homeProducts)
router.route('/products').get(getAllProducts)
router.route('/flutterproducts').get(getAllProductsForFlutter)
router.route('/product/:id').get(getSingleProduct)
router.route('/admin/product/new').post(isAuthenticated, authorizeRole('admin'),createProduct)
router.route('/admin/product/:id')
.put(isAuthenticated, authorizeRole('admin'),updateProduct)
.delete(isAuthenticated, authorizeRole('admin'),deleteProduct)

router.route('/review').put(isAuthenticated, createReview)
router.route('/reviews')
.get(isAuthenticated, getProductReview)
.delete(isAuthenticated, deleteProductReview)
// auth
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/googleLogin').post(googleLogin)
// router.route('/password/forgot').post(forgotPassword)
// router.route('/password/reset/:token').put(resetPassword)
router.route('/logout').get(logout)
// profile
router.route('/me').get(isAuthenticated ,getUserProfile)
router.route('/password/update').put(isAuthenticated ,updatePassword)
router.route('/me/update').put(isAuthenticated ,updateProfile)
// admin routes
router.route('/admin/users').get(isAuthenticated, authorizeRole('admin'), allUser)
router.route('/admin/user/:id').get(isAuthenticated, authorizeRole('admin'), getSingleUser)
.put(isAuthenticated, authorizeRole('admin'), updateUser)
.delete(isAuthenticated, authorizeRole('admin'), deleteUser)
// order
router.route('/order/new').post(isAuthenticated, createOrder)
router.route('/order/:id').get(isAuthenticated, getOrder)
router.route('/orders/me').get(isAuthenticated, myOrders)
router.route('/admin/orders').get(isAuthenticated, authorizeRole('admin'), allOrders)
router.route('/admin/order/:id')
.put(isAuthenticated, authorizeRole('admin'), updateOrder)
.delete(isAuthenticated, authorizeRole('admin'), deleteOrder)

export default router