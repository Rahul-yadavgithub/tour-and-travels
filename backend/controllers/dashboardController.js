const Enquiry = require('../models/Enquiry');
const Package = require('../models/Package');
const RouteTemplate = require('../models/RouteTemplate');
const Review = require('../models/Review');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalEnquiries, totalPackages, totalRoutes, pendingReviews] = await Promise.all([
      Enquiry.countDocuments(),
      Package.countDocuments(),
      RouteTemplate.countDocuments(),
      Review.countDocuments({ status: 'pending' })
    ]);

    res.status(200).json({
      totalEnquiries,
      totalPackages,
      totalRoutes,
      pendingReviews
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    // Fetch latest 5 enquiries
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5).lean();
    
    // Fetch latest 5 reviews
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(5).lean();

    // Transform and unify
    const activity = [
      ...enquiries.map(e => ({
        id: e._id,
        type: 'enquiry',
        title: `New Enquiry from ${e.fullName}`,
        description: `Package: ${e.package || 'General Inquiry'}`,
        date: e.createdAt,
        status: e.status
      })),
      ...reviews.map(r => ({
        id: r._id,
        type: 'review',
        title: `New ${r.rating}-Star Review`,
        description: `By ${r.name}`,
        date: r.createdAt,
        status: r.status
      }))
    ];

    // Sort combined by date descending
    activity.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Return only top 5 recent activities
    res.status(200).json(activity.slice(0, 5));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recent activity', error: err.message });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enquiries', error: err.message });
  }
};

exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(enquiry);
  } catch (err) {
    res.status(500).json({ message: 'Error updating enquiry status', error: err.message });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Enquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting enquiry', error: err.message });
  }
};
