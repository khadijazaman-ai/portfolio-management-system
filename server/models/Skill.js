const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  level: {
    type: String,
    default: 'Intermediate'
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 75
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', SkillSchema);
