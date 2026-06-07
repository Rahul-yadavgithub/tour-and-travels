const express = require('express');
const router = express.Router();

const { getPublicGuide } = require('../controllers/guideController');
const { getPublicPhotos, getAllPublicPhotos } = require('../controllers/portfolioController');
const { getPublicCars, getAllPublicCars } = require('../controllers/carController');
const { getPublicHotels, getAllPublicHotels } = require('../controllers/hotelController');
const { getPublicGuideReviews, createPublicReview } = require('../controllers/reviewController');

// All routes are public and read-only, scoped to a specific guideId
// Exception: POST /reviews allows customers to submit new pending reviews

router.get('/portfolio', getAllPublicPhotos);
router.get('/cars', getAllPublicCars);
router.get('/hotels', getAllPublicHotels);
router.get('/guide/:guideId', getPublicGuide);
router.get('/guide/:guideId/portfolio', getPublicPhotos);
router.get('/guide/:guideId/cars', getPublicCars);
router.get('/guide/:guideId/hotels', getPublicHotels);
router.get('/guide/:guideId/reviews', getPublicGuideReviews);
router.post('/guide/:guideId/reviews', createPublicReview);

module.exports = router;
