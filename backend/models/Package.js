const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  legacyId: { type: Number }, // To preserve the hardcoded ID for existing routes
  title: { type: String, required: true },
  tag: { type: String }, // The old 'tag' field (e.g. "VIP Support")
  location: { type: String },
  duration: { type: String },
  
  // Dynamic Pricing System
  currentPrice: { type: Number, required: true, default: 4999 },
  oldPrice: { type: Number },
  discountPercentage: { type: Number },
  
  // Legacy Content
  overview: { type: String },
  officialInfo: { type: String }, 
  
  // Array contents
  features: [{ type: String }], // Main highlight bullet points
  includedServices: [{ type: String }],
  excludedServices: [{ type: String }],
  
  itinerary: [{
    title: { type: String },
    desc: { type: String }
  }],

  // Media Management
  imageUrl: { type: String }, // Legacy main image
  imageUrls: [{ type: String }], // Array for sliders
  cloudinaryPublicIds: [{ type: String }], // To track Cloudinary uploads for deletion
  
  // Feature Toggles
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  
  category: { type: String, default: 'General' },
  updatedBy: { type: String, default: 'System' },
  
  // AI Generated Premium Content
  aiContent: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

// Pre-save hook to calculate discount percentage
PackageSchema.pre('save', function() {
  if (this.oldPrice && this.currentPrice && this.oldPrice > this.currentPrice) {
    this.discountPercentage = Math.round(((this.oldPrice - this.currentPrice) / this.oldPrice) * 100);
  } else {
    this.discountPercentage = 0;
  }
});

module.exports = mongoose.model('Package', PackageSchema);
