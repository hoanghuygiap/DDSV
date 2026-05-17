const express = require('express');
const router = express.Router();

const QrController = require('../controllers/qrController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', authMiddleware, QrController.generate);

router.get('/current/:sessionId', authMiddleware, QrController.getCurrent);

router.post('/scan', authMiddleware, QrController.scan);

router.post('/refresh', authMiddleware, QrController.refresh);

router.get('/history/:sessionId', authMiddleware, QrController.history);

module.exports = router;