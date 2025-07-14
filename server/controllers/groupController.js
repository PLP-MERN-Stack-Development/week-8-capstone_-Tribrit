
const Group = require('../models/groupModel');
const User = require('../models/userModel');

// ✅ Create group (admin = creator)
const createGroup = async (req, res) => {
  try {
    const { name, description, goal, targetAmount, monthlyContribution } = req.body;

    const group = new Group({
      name,
      description,
      goal,
      targetAmount,
      monthlyContribution,
      admin: req.user.id,
      members: [req.user.id] // Admin is also the first member
    });

    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get all groups where the user is a member
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get a single group by ID
const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get group members (only if user is a member)
const getGroupMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name email');
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isMember = group.members.some(m => m._id.toString() === req.user.id);
    if (!isMember) return res.status(403).json({ message: 'Not authorized to view members' });

    res.json(group.members);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Invite member by email (admin only)
const inviteMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    const user = await User.findOne({ email: req.body.email });

    if (!group || !user) return res.status(404).json({ message: 'Group or user not found' });

    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can invite members' });
    }

    if (!group.members.includes(user._id)) {
      group.members.push(user._id);
      await group.save();
    }

    res.json({ message: '✅ Member invited successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Remove a member (admin only)
const removeMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    const { memberId } = req.body;

    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can remove members' });
    }

    group.members = group.members.filter(m => m.toString() !== memberId);
    await group.save();

    res.json({ message: 'Member removed successfully', members: group.members });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Leave group (members only; admin cannot leave)
const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.admin.toString() === req.user.id) {
      return res.status(403).json({ message: 'Admin cannot leave their own group' });
    }

    group.members = group.members.filter(m => m.toString() !== req.user.id);
    await group.save();

    res.json({ message: 'Left the group successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Export all functions
module.exports = {
  createGroup,
  getGroups,
  getGroup,
  getGroupMembers,
  inviteMember,
  removeMember,
  leaveGroup
};
