const router = require('express').Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// REGISTER
router.post('/register', authController.register);

// LOGIN
router.post('/login', authController.login);

// CHANGE PASSWORD (Authenticated)
router.put('/change-password', auth, authController.changePassword);

module.exports = router;
