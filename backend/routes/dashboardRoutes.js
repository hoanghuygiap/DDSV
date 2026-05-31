const express = require('express');
const router = express.Router();

const DashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');


router.get(
    '/admin',
    authMiddleware,
    DashboardController.getAdminDashboard
);

router.get(
    '/lecturer',
    authMiddleware,
    DashboardController.getLecturerDashboard
);

router.get(
    '/student',
    authMiddleware,
    DashboardController.getStudentDashboard
);

module.exports = router;