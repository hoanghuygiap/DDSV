const express = require('express');
const router = express.Router();

const NotificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/unread-count', authMiddleware, NotificationController.unreadCount);
router.patch('/read-all', authMiddleware, NotificationController.readAll);

router.get('/', authMiddleware, NotificationController.getMyNotifications);
router.post('/', authMiddleware, NotificationController.create);
router.get('/sent', authMiddleware, NotificationController.getSentNotifications);
router.get('/:id', authMiddleware, NotificationController.getDetail);
router.patch('/:id/read', authMiddleware, NotificationController.markAsRead);
router.delete('/:id', authMiddleware, NotificationController.remove);

module.exports = router;