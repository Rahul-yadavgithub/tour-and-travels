const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/enquiries', apiController.createEnquiry);
router.get('/packages', apiController.getPackages);
router.get('/packages/:id', apiController.getPackageById);
router.get('/stats', apiController.getStats);

// Review routes
router.post('/reviews', apiController.createReview);
router.get('/reviews', apiController.getReviews);
router.patch('/reviews/:id/approve', apiController.approveReview);

module.exports = router;
