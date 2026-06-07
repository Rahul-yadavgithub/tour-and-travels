const Review = require('../models/Review');

// Guide Dashboard Routes
const getGuideReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      $or: [
        { guideId: req.guideId },
        { guideId: { $exists: false } },
        { guideId: null }
      ]
    }).sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

const moderateReview = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const review = req.resource; // From guideOwnership middleware

    if (status === 'rejected') {
      await review.deleteOne();
      return res.json({ message: "Review deleted successfully", _id: review._id });
    }

    review.status = status;
    review.moderatedAt = Date.now();
    
    // For backwards compatibility with any existing frontend code
    review.isApproved = status === 'approved';

    await review.save();
    
    res.json(review);
  } catch (error) {
    console.error("Moderate Review Error:", error);
    res.status(500).json({ message: "Error moderating review" });
  }
};

// Public Routes
const getPublicGuideReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      guideId: req.params.guideId,
      status: 'approved'
    }).sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching public reviews" });
  }
};

const createPublicReview = async (req, res) => {
  try {
    const { name, from, text, rating } = req.body;
    
    const newReview = await Review.create({
      guideId: req.params.guideId,
      name,
      from,
      text,
      rating,
      status: 'pending',
      isApproved: false // default
    });

    res.status(201).json({ message: "Review submitted successfully. Pending approval.", review: newReview });
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({ message: "Error submitting review" });
  }
};

module.exports = {
  getGuideReviews,
  moderateReview,
  getPublicGuideReviews,
  createPublicReview
};
