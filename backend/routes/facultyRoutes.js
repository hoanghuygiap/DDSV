const express = require('express');
const router = express.Router();

const FacultyController = require('../controllers/facultyController');
const authMiddleware = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/roleMiddleware');

router.get(
    '/',
    authMiddleware,
    requirePermission('faculty.view'),
    FacultyController.getAllFaculties
);

router.post(
    '/',
    authMiddleware,
    requirePermission('faculty.create'),
    FacultyController.createFaculty
);

router.put(
    '/:id',
    authMiddleware,
    requirePermission('faculty.update'),
    FacultyController.updateFaculty
);

router.delete(
    '/:id',
    authMiddleware,
    requirePermission('faculty.delete'),
    FacultyController.deleteFaculty
);

module.exports = router;