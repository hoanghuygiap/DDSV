const express = require('express');
const router = express.Router();

const DeviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/register', DeviceController.registerDevice);
router.put('/push-token', DeviceController.updatePushToken);
router.delete('/:id', DeviceController.deleteDevice);
router.get('/my', DeviceController.getMyDevices);

module.exports = router;