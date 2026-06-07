const express = require('express');
const router = express.Router();

const clerkAuth = require('../middleware/clerkAuth');
const guideOwnership = require('../middleware/guideOwnership');
const { uploadImage } = require('../services/cloudinaryService');

// Models for ownership middleware
const PortfolioPhoto = require('../models/PortfolioPhoto');
const Car = require('../models/Car');
const Hotel = require('../models/Hotel');
const Review = require('../models/Review');

// Controllers
const { getProfile, updateProfile, getDashboardStats } = require('../controllers/guideController');
const { getPhotos, uploadPhoto, deletePhoto, reorderPhotos } = require('../controllers/portfolioController');
const { getCars, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { getHotels, createHotel, updateHotel, deleteHotel } = require('../controllers/hotelController');
const { getGuideReviews, moderateReview } = require('../controllers/reviewController');

// All routes here are protected by Clerk authentication
router.use(clerkAuth);

// --- Profile ---
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// --- Dashboard ---
router.get('/dashboard/stats', getDashboardStats);

// --- Portfolio ---
router.get('/portfolio', getPhotos);
router.post('/portfolio', uploadImage.single('image'), uploadPhoto);
router.delete('/portfolio/:id', guideOwnership(PortfolioPhoto), deletePhoto);
router.patch('/portfolio/reorder', reorderPhotos);

// --- Cars ---
router.get('/cars', getCars);
router.post('/cars', uploadImage.array('images', 10), createCar);
router.put('/cars/:id', guideOwnership(Car), uploadImage.array('images', 10), updateCar);
router.delete('/cars/:id', guideOwnership(Car), deleteCar);

// --- Hotels ---
router.get('/hotels', getHotels);
router.post('/hotels', uploadImage.array('images', 10), createHotel);
router.put('/hotels/:id', guideOwnership(Hotel), uploadImage.array('images', 10), updateHotel);
router.delete('/hotels/:id', guideOwnership(Hotel), deleteHotel);

// --- Reviews ---
router.get('/reviews', getGuideReviews);
router.patch('/reviews/:id/approve', guideOwnership(Review), (req, res, next) => {
  req.body.status = 'approved';
  next();
}, moderateReview);
router.patch('/reviews/:id/reject', guideOwnership(Review), (req, res, next) => {
  req.body.status = 'rejected';
  next();
}, moderateReview);

module.exports = router;
