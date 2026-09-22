const Course = require('../models/Course');

exports.list = async (req, res) => {
  const courses = await Course.find({ user: req.userId }).sort({ createdAt: 1 });
  res.json({ courses });
};

exports.create = async (req, res) => {
  const { name, instructor, color } = req.body;
  if (!name) return res.status(400).json({ message: 'Course name is required' });

  const course = await Course.create({ user: req.userId, name, instructor, color });
  res.status(201).json({ course });
};

exports.remove = async (req, res) => {
  const course = await Course.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json({ message: 'Course deleted' });
};
