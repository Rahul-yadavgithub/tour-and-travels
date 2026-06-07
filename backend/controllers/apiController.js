const Enquiry = require('../models/Enquiry');
const Review = require('../models/Review');
const Stat = require('../models/Stat');
const { notifyAdminNewEnquiry } = require('../services/notificationService');


exports.createEnquiry = async (req, res) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    await newEnquiry.save();

    // Increment enquiries counter in Stat model
    let stat = await Stat.findOne();
    if (!stat) {
      stat = new Stat({ visitors: 1000, enquiries: 100, happyCustomers: 1000 });
    }
    stat.enquiries = (stat.enquiries || 100) + 1;
    await stat.save();

    // Trigger scalable asynchronous notifications
    notifyAdminNewEnquiry(newEnquiry);

    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry: newEnquiry });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting enquiry', error: err.message });
  }
};



exports.getStats = async (req, res) => {
  try {
    let stat = await Stat.findOne();
    if (!stat) {
      stat = new Stat({ visitors: 1000, enquiries: 100, happyCustomers: 1000 }); // Start with the existing base value
    }
    
    // Increment visitor count on each request only if specified
    if (req.query.increment === 'true') {
      stat.visitors += 1;
      await stat.save();
    }
    
    res.status(200).json({
      enquiries: stat.enquiries || 100,
      visitors: stat.visitors,
      happyCustomers: stat.happyCustomers || 1000
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};

// Review Controllers
exports.createReview = async (req, res) => {
  try {
    const { name, from, text, rating } = req.body;
    
    // Explicitly construct the review to prevent users from injecting `isApproved: true` or `status: 'approved'`
    const newReview = new Review({
      name,
      from,
      text,
      rating: rating || 5
      // isApproved and status will safely default to false and 'pending'
    });
    
    await newReview.save();

    // Increment happyCustomers if rating >= 3
    if (newReview.rating >= 3) {
      let stat = await Stat.findOne();
      if (!stat) {
        stat = new Stat({ visitors: 1000, enquiries: 100, happyCustomers: 1000 });
      }
      stat.happyCustomers = (stat.happyCustomers || 1000) + 1;
      await stat.save();
    }

    res.status(201).json({ message: 'Review submitted successfully and is pending approval', review: newReview });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting review', error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const filter = {};
    if (req.query.approved === 'true') filter.isApproved = true;
    if (req.query.approved === 'false') filter.isApproved = false;

    // Fetch reviews sorted by newest first
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
};

exports.approveReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findByIdAndUpdate(reviewId, { isApproved: true }, { new: true });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.status(200).json({ message: 'Review approved successfully', review });
  } catch (err) {
    res.status(500).json({ message: 'Error approving review', error: err.message });
  }
};
