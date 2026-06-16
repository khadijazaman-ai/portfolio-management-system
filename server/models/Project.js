const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  technologies: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    default: 'Web Development',
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  githubLink: {
    type: String,
    default: '',
    trim: true
  },
  githubUrl: {
    type: String,
    default: '',
    trim: true
  },
  liveLink: {
    type: String,
    default: '',
    trim: true
  },
  liveUrl: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Planned'],
    default: 'Completed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);
