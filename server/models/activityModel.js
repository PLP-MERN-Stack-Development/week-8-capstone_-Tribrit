// const mongoose = require('mongoose');

// const activitySchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
//   message: String,
//   date: { type: Date, default: Date.now },
// }, { timestamps: true });

// module.exports = mongoose.model('Activity', activitySchema);




const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['join', 'contribute', 'invite', 'remove'],
    required: true
  },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
