const express = require('express');
const router = express.Router();

const ReportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/attendance', authMiddleware, ReportController.attendance);
router.get('/top-absent', authMiddleware, ReportController.topAbsent);
router.get('/weekly-attendance', authMiddleware, ReportController.weeklyAttendance);
router.get('/export', authMiddleware, ReportController.exportReport);
router.get('/by-course-class', authMiddleware, ReportController.byCourseClass);
router.get('/by-semester', authMiddleware, ReportController.bySemester);

module.exports = router;