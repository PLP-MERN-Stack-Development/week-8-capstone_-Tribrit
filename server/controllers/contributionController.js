
// const Contribution = require('../models/contributionModel');

// exports.createContribution = async (req, res) => {
//   try {
//     const { groupId, amount, proof } = req.body;
//     const userId = req.user.id;

//     const contribution = new Contribution({
//       user: userId,
//       group: groupId,
//       amount,
//       proof
//     });

//     await contribution.save();
//     res.status(201).json(contribution);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create contribution', error: err.message });
//   }
// };

// exports.getGroupContributions = async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const contributions = await Contribution.find({ group: groupId }).populate('user', 'name');

//     res.status(200).json(contributions);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to load contributions', error: err.message });
//   }
// };







// // Show logged-in user's contributions in a group
// exports.getMyContributions = async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const userId = req.user.id;

//     const contributions = await Contribution.find({ group: groupId, user: userId })
//       .sort({ date: -1 });

//     res.status(200).json(contributions);
//   } catch (err) {
//     res.status(500).json({ message: 'Error loading your contributions', error: err.message });
//   }
// };

// // Show all contributions in a group (admin only)
// exports.getAllGroupContributions = async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const userId = req.user.id;

//     const group = await require('../models/groupModel').findById(groupId);
//     if (!group) return res.status(404).json({ message: 'Group not found' });

//     if (group.admin.toString() !== userId)
//       return res.status(403).json({ message: 'Only admin can view all contributions' });

//     const contributions = await Contribution.find({ group: groupId })
//       .populate('user', 'name email')
//       .sort({ date: -1 });

//     res.status(200).json(contributions);
//   } catch (err) {
//     res.status(500).json({ message: 'Error loading group contributions', error: err.message });
//   }
// };

// // Show group progress toward target
// exports.getGroupProgress = async (req, res) => {
//   try {
//     const { groupId } = req.params;

//     const group = await require('../models/groupModel').findById(groupId);
//     if (!group) return res.status(404).json({ message: 'Group not found' });

//     const allContributions = await Contribution.find({ group: groupId });

//     const total = allContributions.reduce((sum, c) => sum + c.amount, 0);
//     const balance = group.targetAmount - total;

//     res.status(200).json({
//       groupName: group.name,
//       target: group.targetAmount,
//       totalContributed: total,
//       remainingBalance: balance > 0 ? balance : 0
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching group progress', error: err.message });
//   }
// };




const Contribution = require('../models/contributionModel');
const Group = require('../models/groupModel');

// ✅ Create a contribution
exports.createContribution = async (req, res) => {
  try {
    const { groupId, amount, proof } = req.body;
    const userId = req.user.id;

    const contribution = new Contribution({
      user: userId,
      group: groupId,
      amount,
      proof
    });

    await contribution.save();
    res.status(201).json(contribution);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create contribution', error: err.message });
  }
};

// ✅ Get all contributions in a group (admin only)
exports.getAllGroupContributions = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can view all contributions' });
    }

    const contributions = await Contribution.find({ group: groupId })
      .populate('user', 'name email')
      .sort({ date: -1 });

    res.status(200).json(contributions);
  } catch (err) {
    res.status(500).json({ message: 'Error loading group contributions', error: err.message });
  }
};

// ✅ Show logged-in user's own contributions in a group
exports.getMyContributions = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const contributions = await Contribution.find({ group: groupId, user: userId })
      .sort({ date: -1 });

    res.status(200).json(contributions);
  } catch (err) {
    res.status(500).json({ message: 'Error loading your contributions', error: err.message });
  }
};

// ✅ Get group progress toward target
exports.getGroupProgress = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const allContributions = await Contribution.find({ group: groupId });

    const total = allContributions.reduce((sum, c) => sum + c.amount, 0);
    const balance = group.targetAmount - total;

    res.status(200).json({
      groupName: group.name,
      target: group.targetAmount,
      totalContributed: total,
      remainingBalance: balance > 0 ? balance : 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching group progress', error: err.message });
  }
};

// ✅ OPTIONAL: Internal use – delete all a member's contributions if removed
const deleteContributionsOfUser = async (userId, groupId) => {
  try {
    await Contribution.deleteMany({ user: userId, group: groupId });
  } catch (err) {
    console.error('Error deleting contributions for removed user:', err.message);
  }
};

// You can export this if needed in other modules
exports._internal = {
  deleteContributionsOfUser
};
