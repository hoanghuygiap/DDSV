const express = require('express');
const router = express.Router();

const SubjectController = require('../controllers/subjectController');

const authMiddleware = require('../middleware/authMiddleware');

const {
    requirePermission
} = require('../middleware/roleMiddleware');

router.get(
    '/',
    authMiddleware,
    requirePermission('course.view'),
    SubjectController.getAllSubjects
);

router.get(
    '/:id',
    authMiddleware,
    requirePermission('course.view'),
    SubjectController.getSubjectById
);

router.post(
    '/',
    authMiddleware,
    requirePermission('course.create'),
    SubjectController.createSubject
);

router.put(
    '/:id',
    authMiddleware,
    requirePermission('course.update'),
    SubjectController.updateSubject
);

router.delete(
    '/:id',
    authMiddleware,
    requirePermission('course.delete'),
    SubjectController.deleteSubject
);

module.exports = router;