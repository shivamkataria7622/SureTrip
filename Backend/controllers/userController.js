const { db } = require('../config/firebase');

// Synchronize user profile from Firebase Auth into Firestore DB
const signup = async (req, res) => {
    console.log('Incoming Signup Request:', req.body);
    try {
        // Since verifyToken is bypassed, read directly from req.body
        const { email, name, password, role } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required in request body' });
        }

        // Use email directly as doc ID for easy lookup, matches getUserProfile
        const uid = email; 
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            // New user, create the profile
            await userRef.set({
                 // Use email as UID or keep it for compatibility
                uid: db.collection('users').doc().id, // NATIVE FIREBASE ID GENERATOR (Bug fixed!)
                email,
                name: name || '',
                createdAt: new Date().toISOString(),
                fcmToken: '',
                role: role || null, // No default role until user selects one on the RoleSelectScreen
                password: password
            });
            return res.status(201).json({ message: 'User profile created successfully', uid: uid });
        } else {
            // User exists, optionally update their data if needed, like their latest login provider
            await userRef.update({
                lastLoginAt: new Date().toISOString(),
            });
            return res.status(200).json({ message: 'User profile synchronized', user: doc.data() });
        }
    } catch (error) {
        console.error('Error syncing user:', error);
        return res.status(500).json({ message: 'Internal Server Error' }); // Added return to prevent header crash
    }
};

const getUserProfile = async (req, res) => {
    console.log('Incoming Signin Request:', req.body);
    try {
        // Since verifyToken is bypassed, read from req.body or query
        const { email, password, name, role } = req.body;
        
        if (!email) {
             return res.status(400).json({ message: 'email is required in request body' });
        }
        
        const userRef = db.collection('users').doc(email);
        const doc = await userRef.get();
        
        if (!doc.exists) {
            console.log("User not found - creating profile");
            // AWAIT this so Express knows to wait for the response to finish
          
            return res.status(404).json({ message: 'User not found' }); 
        } else {
            if (password !== doc.data().password) {
                return res.status(401).json({ message: 'Invalid password' });
            } else {
                return res.status(200).json({ user: doc.data() });
            }
        }
    } catch (error) {
         console.error('Error fetching user profile:', error);
         return res.status(500).json({ message: 'Internal Server Error' }); // Added return
    }
};

const updateProfile = async (req, res) => {
    try {
        const { uid, role } = req.body;
        if (!uid) {
            return res.status(400).json({ message: 'uid is required in request body' });
        }
        
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();
        
        if (!doc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        await userRef.update({
            role: role || doc.data().role,
            updatedAt: new Date().toISOString(),
        });
        
        return res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: 'Internal Server Error' }); // Added return
    }
};

const getSellers = async (req, res) => {
    try {
        const sellersSnapshot = await db.collection('users')
            .where('role', '==', 'seller')
            .get();

        const sellers = [];
        sellersSnapshot.forEach((doc) => {
            const data = doc.data();
            sellers.push({
                id: doc.id,
                sellerId: doc.id, // email is the doc ID
                shopName: data.shopName || data.name || 'Shop',
                email: data.email,
                shopCategory: data.shopCategory || 'General',
                shopAddress: data.shopAddress || '',
            });
        });

        return res.status(200).json(sellers);
    } catch (error) {
        console.error('Error fetching sellers:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.updateProfile = updateProfile;
module.exports.signup = signup;
module.exports.getUserProfile = getUserProfile;
module.exports.getSellers = getSellers;