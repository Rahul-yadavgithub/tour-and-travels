const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  city: { type: String },
  travelDate: { type: String },
  adults: { type: Number, default: 2 },
  children: { type: Number, default: 0 },
  budget: { type: String },
  package: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', EnquirySchema);
