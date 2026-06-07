const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const clerkAuth = require('../middleware/clerkAuth');

// Protect all dashboard routes
router.use(clerkAuth);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/activity', dashboardController.getRecentActivity);

// Enquiries Management
router.get('/enquiries', dashboardController.getEnquiries);
router.put('/enquiries/:id/status', dashboardController.updateEnquiryStatus);
router.delete('/enquiries/:id', dashboardController.deleteEnquiry);

module.exports = router;
