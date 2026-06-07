const mongoose = require('mongoose');

const PickupPointSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'Airport', 'Railway Station'
  image: { type: String },
  cloudinaryPublicId: { type: String }, // For image management
  description: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('PickupPoint', PickupPointSchema);
