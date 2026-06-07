const mongoose = require('mongoose');

const RouteStopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  cloudinaryPublicId: { type: String },
  description: { type: String },
  order: { type: Number, required: true }
});

const RouteTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pickupPointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PickupPoint',
    required: true
  },
  dropPointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PickupPoint'
  },
  estimatedTime: { type: String },
  distance: { type: String },
  stops: [RouteStopSchema]
}, { timestamps: true });

module.exports = mongoose.model('RouteTemplate', RouteTemplateSchema);
