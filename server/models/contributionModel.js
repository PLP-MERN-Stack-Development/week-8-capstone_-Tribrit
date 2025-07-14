
const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  amount: { type: Number, required: true },
  proof: { type: String }, // URL to receipt image or M-Pesa code
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contribution', ContributionSchema);
