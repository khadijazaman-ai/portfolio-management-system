const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  about: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  tagline: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  education: {
    type: String,
    default: ''
  },
  careerGoals: {
    type: String,
    default: ''
  },
  interests: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
