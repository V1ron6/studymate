const Note = require('../models/Note');

exports.list = async (req, res) => {
  const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ notes });
};

exports.create = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Note text is required' });

  const note = await Note.create({ user: req.userId, text });
  res.status(201).json({ note });
};

exports.remove = async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Note deleted' });
};
