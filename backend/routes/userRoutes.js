const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { requirePermission } = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware'); // 👈 JWT thật

// 🔐 THAY mockAuth BẰNG JWT
router.use(authMiddleware);

router.get('/', requirePermission('user.view'), userController.getUsers);

router.get('/:id', requirePermission('user.view'), userController.getUserById);

router.post('/', requirePermission('user.create'), userController.createUser);

router.put('/:id', requirePermission('user.update'), userController.updateUser);

router.delete('/:id', requirePermission('user.delete'), userController.deleteUser);

router.patch('/:id/lock', requirePermission('user.update'), userController.lockUser);

router.patch('/:id/unlock', requirePermission('user.update'), userController.unlockUser);

module.exports = router;