const express = require('express');
const router = express.Router();
const aiContentController = require('../controllers/aiContentController');

// Define route for generating content
router.post('/generate', aiContentController.generateContent);

module.exports = router;
