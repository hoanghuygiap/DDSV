const express = require('express');
const router = express.Router();

const ValidateController = require('../controllers/validateController');
const authMiddleware = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/roleMiddleware');

router.post(
    '/gps',
    authMiddleware,
    requirePermission('attendance.checkin'),
    ValidateController.validateGPS
);

module.exports = router;