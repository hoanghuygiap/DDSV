const express = require('express');
const router = express.Router();

const MajorController = require('../controllers/majorController');

const authMiddleware = require('../middleware/authMiddleware');

const {
    requirePermission
} = require('../middleware/roleMiddleware');

router.get(
    '/',
    authMiddleware,
    requirePermission('major.view'),
    MajorController.getAllMajors
);

router.post(
    '/',
    authMiddleware,
    requirePermission('major.create'),
    MajorController.createMajor
);

router.put(
    '/:id',
    authMiddleware,
    requirePermission('major.update'),
    MajorController.updateMajor
);

router.delete(
    '/:id',
    authMiddleware,
    requirePermission('major.delete'),
    MajorController.deleteMajor
);

module.exports = router;