const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    instructor: { type: String, trim: true, default: '' },
    color: { type: String, default: '#5b5bf6' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
