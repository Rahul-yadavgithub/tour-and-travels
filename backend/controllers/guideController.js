const Guide = require('../models/Guide');
const PortfolioPhoto = require('../models/PortfolioPhoto');
const Car = require('../models/Car');
const Hotel = require('../models/Hotel');
const Review = require('../models/Review');

const getProfile = async (req, res) => {
  try {
    res.json(req.guide);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    req.guide.name = name !== undefined ? name : req.guide.name;
    req.guide.phone = phone !== undefined ? phone : req.guide.phone;
    
    // Note: profile photo upload would be a separate endpoint or handled with multer here
    // For now, handling basic text fields
    
    await req.guide.save();
    res.json(req.guide);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const guideId = req.guideId;

    const [totalPhotos, totalCars, totalHotels, pendingReviews] = await Promise.all([
      PortfolioPhoto.countDocuments({ guideId, status: 'active' }),
      Car.countDocuments({ guideId, status: 'active' }),
      Hotel.countDocuments({ guideId, status: 'active' }),
      Review.countDocuments({ guideId, status: 'pending' })
    ]);

    res.json({
      totalPhotos,
      totalCars,
      totalHotels,
      pendingReviews
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};

// Public Routes
const getPublicGuide = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.guideId).select('-clerkUserId');
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.json(guide);
  } catch (error) {
    res.status(500).json({ message: "Error fetching guide" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats,
  getPublicGuide
};
