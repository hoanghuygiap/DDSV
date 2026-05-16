const express = require('express');
const router = express.Router();

const ClassController = require('../controllers/classController');
const authMiddleware = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/roleMiddleware');

router.get(
    '/',
    authMiddleware,
    requirePermission('class.view'),
    ClassController.getAllClasses
);

router.post(
    '/',
    authMiddleware,
    requirePermission('class.create'),
    ClassController.createClass
);

router.put(
    '/:id',
    authMiddleware,
    requirePermission('class.update'),
    ClassController.updateClass
);

router.delete(
    '/:id',
    authMiddleware,
    requirePermission('class.delete'),
    ClassController.deleteClass
);

module.exports = router;