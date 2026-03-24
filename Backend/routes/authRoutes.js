const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { syncUser, getUserProfile } = require('../controllers/userController');
const { auth_google } = require('../controllers/googleAuth');
// POST /api/users/sync - called by the React Native app right after Google/Apple login
router.post("/auth_google", auth_google);

module.exports = router;