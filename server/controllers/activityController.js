// const Activity = require('../models/activityModel');

// exports.getGroupActivities = async (req, res) => {
//   try {
//     const activities = await Activity.find({ group: req.params.groupId }).populate('user', 'name');
//     res.json(activities);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };


const Activity = require('../models/activityModel');

exports.getGroupActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ group: req.params.groupId })
      .populate('user', 'name')
      .sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load feed', error: err.message });
  }
};
