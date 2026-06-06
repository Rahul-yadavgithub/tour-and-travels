const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/enquiries', apiController.createEnquiry);
router.get('/packages', apiController.getPackages);
router.get('/packages/:id', apiController.getPackageById);
router.get('/stats', apiController.getStats);

module.exports = router;
