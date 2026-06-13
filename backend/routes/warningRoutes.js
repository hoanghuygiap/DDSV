const express = require('express');
const router = express.Router();

const WarningController = require('../controllers/warningController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, WarningController.getAll);
router.post('/', authMiddleware, WarningController.create);

router.post('/auto-generate', authMiddleware, WarningController.autoGenerate);
router.post('/auto-generate-all', authMiddleware, WarningController.autoGenerateAll);

router.patch('/:id/process', authMiddleware, WarningController.process);
router.delete('/:id', authMiddleware, WarningController.remove);
router.get('/student/:id', authMiddleware, WarningController.getByStudent);
router.get('/course-class/:id', authMiddleware, WarningController.getByCourseClass);

module.exports = router;