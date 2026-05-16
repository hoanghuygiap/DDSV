const express = require('express');
const router = express.Router();

const SemesterController = require('../controllers/semesterController');
const authMiddleware = require('../middleware/authMiddleware');

const {
    requirePermission
} = require('../middleware/roleMiddleware');

router.get(
    '/',
    authMiddleware,
    requirePermission('semester.view'),
    SemesterController.getAllSemesters
);

router.get(
    '/:id',
    authMiddleware,
    requirePermission('semester.view'),
    SemesterController.getSemesterById
);

router.post(
    '/',
    authMiddleware,
    requirePermission('semester.create'),
    SemesterController.createSemester
);

router.put(
    '/:id',
    authMiddleware,
    requirePermission('semester.update'),
    SemesterController.updateSemester
);

router.delete(
    '/:id',
    authMiddleware,
    requirePermission('semester.delete'),
    SemesterController.deleteSemester
);

module.exports = router;