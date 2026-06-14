const express = require('express');
const router = express.Router();
const multer = require('multer');

const StudentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/roleMiddleware');

const upload = multer({ dest: 'uploads/' });

router.post(
    '/import',
    authMiddleware,
    requirePermission('user.create'),
    upload.single('file'),
    StudentController.importStudents
);

router.get(
    '/',
    authMiddleware,
    requirePermission('user.view'),
    StudentController.getAllStudents
);

router.get(
    '/:id',
    authMiddleware,
    requirePermission('user.view'),
    StudentController.getStudentById
);

router.post(
    '/',
    authMiddleware,
    requirePermission('user.create'),
    StudentController.createStudent
);

router.put(
    '/:id',
    authMiddleware,
    requirePermission('user.update'),
    StudentController.updateStudent
);

router.delete(
    '/:id',
    authMiddleware,
    requirePermission('user.delete'),
    StudentController.deleteStudent
);

router.get(
    '/:id/classes',
    authMiddleware,
    requirePermission('attendance.view'),
    StudentController.getStudentClasses
);

router.get(
    '/:id/schedule',
    authMiddleware,
    requirePermission('attendance.view'),
    StudentController.getStudentSchedule
);

router.get(
    '/:id/attendance',
    authMiddleware,
    requirePermission('attendance.view'),
    StudentController.getStudentAttendance
);

router.get(
    '/:id/statistics',
    authMiddleware,
    requirePermission('report.view'),
    StudentController.getStudentStatistics
);

module.exports = router;