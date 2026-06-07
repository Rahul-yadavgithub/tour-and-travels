const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  profilePhotoUrl: {
    type: String
  },
  profilePhotoPublicId: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Guide', guideSchema);
