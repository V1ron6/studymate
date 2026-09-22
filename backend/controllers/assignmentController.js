const Assignment = require('../models/Assignment');

exports.list = async (req, res) => {
  const assignments = await Assignment.find({ user: req.userId })
    .populate('course', 'name color')
    .sort({ due: 1 });
  res.json({ assignments });
};

exports.create = async (req, res) => {
  const { title, course, due } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const assignment = await Assignment.create({
    user: req.userId,
    title,
    course: course || null,
    due: due || null,
  });
  res.status(201).json({ assignment });
};

exports.update = async (req, res) => {
  const { title, due, done, course } = req.body;
  const assignment = await Assignment.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { $set: { title, due, done, course } },
    { new: true, omitUndefined: true }
  );
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  res.json({ assignment });
};

exports.remove = async (req, res) => {
  const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  res.json({ message: 'Assignment deleted' });
};
