const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  visitors: {
    type: Number,
    default: 100 // Starting with the current hardcoded value
  },
  enquiries: {
    type: Number,
    default: 200 // Base enquiries count
  },
  happyCustomers: {
    type: Number,
    default: 100 // Base happy travelers count
  }
});

module.exports = mongoose.model('Stat', statSchema);
