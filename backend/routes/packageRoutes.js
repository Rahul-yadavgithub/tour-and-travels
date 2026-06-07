const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const clerkAuth = require('../middleware/clerkAuth');

// --- Public Routes ---
// These replace the hardcoded ones in apiRoutes.js
router.get('/', packageController.getPackages);
router.get('/:id', packageController.getPackageById);

// --- Protected Admin Routes ---
router.use(clerkAuth);

// Edit packages & pricing
router.put('/:id', packageController.updatePackage);
router.patch('/:id/price', packageController.updatePackagePrice);

// Image Upload & Management
const { uploadImage } = require('../services/cloudinaryService');
router.post('/:id/images', uploadImage.array('images', 10), packageController.uploadPackageImages);
router.delete('/:id/images/:imageIndex', packageController.deletePackageImage);



module.exports = router;
