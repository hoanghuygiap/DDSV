const express = require('express');
const router = express.Router();

const SessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/roleMiddleware');

// PATCH đặc biệt để TRƯỚC /:id
router.patch(
    '/:id/open-attendance',
    authMiddleware,
    requirePermission('attendance.create'),
    SessionController.openAttendance
);

router.patch(
    '/:id/close-attendance',
    authMiddleware,
    requirePermission('attendance.update'),
    SessionController.closeAttendance
);

router.patch(
    '/:id/change-room',
    authMiddleware,
    requirePermission('attendance.update'),
    SessionController.changeRoom
);

// Các route thường để SAU
router.get(
    '/',
    authMiddleware,
    requirePermission('attendance.view'),
    SessionController.getAllSessions
);

router.get(
    '/:id',
    authMiddleware,
    requirePermission('attendance.view'),
    SessionController.getSessionById
);

router.post(
    '/',
    authMiddleware,
    requirePermission('attendance.create'),
    SessionController.createSession
);

router.put(
    '/:id',
    authMiddleware,
    requirePermission('attendance.update'),
    SessionController.updateSession
);

router.delete(
    '/:id',
    authMiddleware,
    requirePermission('attendance.update'),
    SessionController.deleteSession
);

module.exports = router;