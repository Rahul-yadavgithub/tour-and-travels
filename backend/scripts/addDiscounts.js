require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('../models/Package');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tour';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    const packages = await Package.find();
    
    for (let pkg of packages) {
      // Add an old price that is 20-30% higher if not exists
      if (!pkg.oldPrice) {
        const fakeOldPrice = Math.round(pkg.currentPrice * 1.25 / 100) * 100 - 1; 
        pkg.oldPrice = fakeOldPrice;
        await pkg.save();
      }
    }
    
    console.log('Successfully updated all packages with an old price!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
