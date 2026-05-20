const express = require('express');
const router = express.Router();

const RoomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, RoomController.getAll);
router.post('/', authMiddleware, RoomController.create);
router.put('/:id', authMiddleware, RoomController.update);
router.delete('/:id', authMiddleware, RoomController.remove);

router.get('/:id/wifi', authMiddleware, RoomController.getWifi);
router.post('/:id/wifi', authMiddleware, RoomController.addWifi);
router.delete('/:id/wifi/:wifiId', authMiddleware, RoomController.deleteWifi);

module.exports = router;