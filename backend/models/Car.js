const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
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
  photoUrls: [{
    type: String
  }],
  cloudinaryPublicIds: [{
    type: String
  }],
  isAC: {
    type: Boolean,
    default: true
  },
  seatCapacity: {
    type: Number,
    required: true
  },
  luggageCapacity: {
    type: Number
  },
  bestSuitedFor: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'hidden'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
