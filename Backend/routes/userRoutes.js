const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { signup, getUserProfile, updateProfile, getSellers, updateshopprofile } = require('../controllers/userController');

// POST /api/users/sync - called by the React Native app right after Google/Apple login
router.post('/signup', signup);

// GET /api/users/profile - fetch the current user's profile from Firestore
router.post('/signin', getUserProfile);
router.post('/update', updateProfile);
router.get('/sellers', getSellers); // GET all sellers for buyer discovery


//POST API for shop profile
router.post('/updateshopprofile', updateshopprofile);
module.exports = router;
