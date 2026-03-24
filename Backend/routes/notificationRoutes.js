const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { saveFcmToken, sendNotification } = require('../controllers/notificationController');

// POST /api/notifications/token - Save the device's FCM token
router.post('/token', verifyToken, saveFcmToken);

// POST /api/notifications/send - Send a notification to a specific user (Usually called by other backend services, but exposed for testing)
router.post('/send', verifyToken, sendNotification);

module.exports = router;
