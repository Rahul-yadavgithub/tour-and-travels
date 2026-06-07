const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guide',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  roomType: {
    type: String,
    trim: true
  },
  facilities: [{
    type: String,
    trim: true
  }],
  diningInfo: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  photoUrls: [{
    type: String
  }],
  cloudinaryPublicIds: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'hidden'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
