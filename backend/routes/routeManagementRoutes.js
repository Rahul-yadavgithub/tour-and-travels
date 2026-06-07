const express = require('express');
const router = express.Router();
const routeManagementController = require('../controllers/routeManagementController');
const clerkAuth = require('../middleware/clerkAuth');
const { uploadImage } = require('../services/cloudinaryService');

// Public endpoints
router.get('/pickups', routeManagementController.getPickupPoints);
router.get('/templates', routeManagementController.getRouteTemplates);
router.get('/templates/:id', routeManagementController.getRouteTemplateById);

// Protected Admin endpoints
router.use(clerkAuth);

// Pickups
router.post('/pickups', uploadImage.single('image'), routeManagementController.createPickupPoint);
router.put('/pickups/:id', uploadImage.single('image'), routeManagementController.updatePickupPoint);
router.delete('/pickups/:id', routeManagementController.deletePickupPoint);

// Templates
router.post('/templates', uploadImage.any(), routeManagementController.createRouteTemplate);
router.put('/templates/:id', uploadImage.any(), routeManagementController.updateRouteTemplate);
router.delete('/templates/:id', routeManagementController.deleteRouteTemplate);

module.exports = router;
