const express = require('express');
const router = express.Router();

const AttendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
    '/checkin',
    authMiddleware,
    AttendanceController.checkin
);

router.get(
    '/session/:id',
    authMiddleware,
    AttendanceController.getBySession
);

router.get(
    '/student/:id',
    authMiddleware,
    AttendanceController.getByStudent
);

router.put(
    '/:id',
    authMiddleware,
    AttendanceController.update
);

router.delete(
    '/:id',
    authMiddleware,
    AttendanceController.remove
);

router.post(
    '/manual',
    authMiddleware,
    AttendanceController.manual
);

router.post(
    '/auto-absent',
    authMiddleware,
    AttendanceController.autoAbsent
);

router.get(
    '/statistics',
    authMiddleware,
    AttendanceController.statistics
);

router.get(
    '/export-excel',
    authMiddleware,
    AttendanceController.exportExcel
);

router.get(
    '/realtime/:sessionId',
    authMiddleware,
    AttendanceController.realtime
);

module.exports = router;