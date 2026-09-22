const mongoose = require('mongoose');

const timetableSlotSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    day: {
      type: String,
      required: true,
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    time: { type: String, required: true, trim: true },
    label: { type: String, trim: true, default: 'Study' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TimetableSlot', timetableSlotSchema);
