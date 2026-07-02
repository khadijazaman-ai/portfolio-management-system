const router = require('express').Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware');
const { uploadProfile } = require('../middleware/uploadMiddleware');

// GET public profile or logged in user details (Open route)
router.get('/', profileController.getProfile);

// PUT update basic info (Authenticated)
router.put('/', auth, profileController.updateProfile);

// PUT specific sections (preserves compatibility)
router.put('/about', auth, profileController.updateProfileAbout);
router.put('/contact', auth, profileController.updateProfileContact);
router.put('/social', auth, profileController.updateProfileSocial);

// POST upload profile image
router.post('/image', auth, uploadProfile, profileController.uploadProfileImage);

module.exports = router;
