const express = require('express');
const router = express.Router();

const CourseClassController = require('../controllers/courseClassController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');

const upload = multer({
    dest: 'uploads/'
});

const {
    requirePermission
} = require('../middleware/roleMiddleware');

router.get(
    '/',
    authMiddleware,
    requirePermission('course_class.view'),
    CourseClassController.getAll
);
router.get(
    '/my',
    authMiddleware,
    requirePermission('course_class.view'),
    CourseClassController.getMyClasses
);
router.get(
    '/:id/overview',
    authMiddleware,
    requirePermission('course_class.view'),
    CourseClassController.getOverview
);

router.post(
    '/:id/import-students',
    authMiddleware,
    requirePermission('course_class.update'),
    upload.single('file'),
    CourseClassController.importStudents
);

router.get(
    '/:id/students',
    authMiddleware,
    requirePermission('course_class.view'),
    CourseClassController.getStudents
);

router.get(
    '/:id',
    authMiddleware,
    requirePermission('course_class.view'),
    CourseClassController.getById
);

router.post(
    '/',
    authMiddleware,
    requirePermission('course_class.create'),
    CourseClassController.create
);

router.put(
    '/:id',
    authMiddleware,
    requirePermission('course_class.update'),
    CourseClassController.update
);

router.delete(
    '/:id',
    authMiddleware,
    requirePermission('course_class.delete'),
    CourseClassController.delete
);

router.post(
    '/:id/register',
    authMiddleware,
    requirePermission('course_class.update'),
    CourseClassController.registerStudent
);

router.delete(
    '/:id/register/:studentId',
    authMiddleware,
    requirePermission('course_class.update'),
    CourseClassController.unregisterStudent
);

router.post(
    '/:id/self-register',
    authMiddleware,
    requirePermission('course_class.view'),
    CourseClassController.selfRegister
);

router.delete(
    '/:id/self-register',
    authMiddleware,
    requirePermission('course_class.view'),
    CourseClassController.selfUnregister
);




module.exports = router;