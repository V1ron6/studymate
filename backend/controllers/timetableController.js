const TimetableSlot = require('../models/TimetableSlot');

exports.list = async (req, res) => {
  const slots = await TimetableSlot.find({ user: req.userId }).populate('course', 'name color');
  res.json({ slots });
};

exports.create = async (req, res) => {
  const { day, time, label, course } = req.body;
  if (!day || !time) return res.status(400).json({ message: 'Day and time are required' });

  const slot = await TimetableSlot.create({
    user: req.userId,
    day,
    time,
    label: label || 'Study',
    course: course || null,
  });
  res.status(201).json({ slot });
};

exports.remove = async (req, res) => {
  const slot = await TimetableSlot.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!slot) return res.status(404).json({ message: 'Slot not found' });
  res.json({ message: 'Slot deleted' });
};
