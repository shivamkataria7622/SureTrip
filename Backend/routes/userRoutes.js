const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { signup, getUserProfile, updateProfile } = require('../controllers/userController');

// POST /api/users/sync - called by the React Native app right after Google/Apple login
router.post('/signup', signup);

// GET /api/users/profile - fetch the current user's profile from Firestore
router.post('/signin', getUserProfile);
router.post('/update', updateProfile);
module.exports = router;
