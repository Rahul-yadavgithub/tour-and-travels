const express = require('express');
const router = express.Router();
const aiContentController = require('../controllers/aiContentController');

// Define route for generating content
router.post('/generate', aiContentController.generateContent);
router.post('/generate-car-desc', aiContentController.generateCarDesc);
router.post('/generate-hotel-desc', aiContentController.generateHotelDesc);

module.exports = router;
