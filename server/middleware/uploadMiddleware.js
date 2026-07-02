const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const profileDir = path.join(__dirname, '../uploads/profiles');
const projectDir = path.join(__dirname, '../uploads/projects');

if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });
if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });

// Profile storage config
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Project storage config
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (JPG, JPEG, PNG, WEBP only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WEBP formats are allowed!'), false);
  }
};

// Set 4MB size limits
const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: fileFilter
});

const uploadProject = multer({
  storage: projectStorage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: fileFilter
});

module.exports = {
  uploadProfile: uploadProfile.single('profileImage'),
  uploadProject: uploadProject.single('projectImage')
};
