const express = require('express');

const router = express.Router();

const LecturerController = require('../controllers/lecturerController');

const authMiddleware = require('../middleware/authMiddleware');

const {
    requirePermission
} = require('../middleware/roleMiddleware');

router.get(
    '/',
    authMiddleware,
    requirePermission('lecturer.view'),
    LecturerController.getAllLecturers
);

router.get(
    '/:id',
    authMiddleware,
    requirePermission('lecturer.view'),
    LecturerController.getLecturerById
);

router.post(
    '/',
    authMiddleware,
    requirePermission('user.create'),
    LecturerController.createLecturer
);

router.put(
    '/:id',
    authMiddleware,
    requirePermission('user.update'),
    LecturerController.updateLecturer
);

router.delete(
    '/:id',
    authMiddleware,
    requirePermission('user.delete'),
    LecturerController.deleteLecturer
);

router.get(
    '/:id/schedule',
    authMiddleware,
    requirePermission('attendance.view'),
    LecturerController.getLecturerSchedule
);

router.get(
    '/:id/course-classes',
    authMiddleware,
    requirePermission('attendance.view'),
    LecturerController.getLecturerCourseClasses
);

module.exports = router;