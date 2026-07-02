const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

// GET dashboard statistics (Authenticated)
router.get('/stats', auth, dashboardController.getStats);

// GET recent activity feed (Authenticated)
router.get('/recent-activity', auth, dashboardController.getRecentActivity);

// GET notifications (Authenticated)
router.get('/notifications', auth, notificationController.getNotifications);

// PUT mark all notifications as read (Authenticated)
router.put('/notifications/mark-read', auth, notificationController.markAllRead);

// PUT mark single notification as read (Authenticated)
router.put('/notifications/:id/read', auth, notificationController.markRead);

module.exports = router;
