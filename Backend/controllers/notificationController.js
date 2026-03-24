const { db, messaging } = require('../config/firebase');

// Save or updating the FCM device token for a user
const saveFcmToken = async (req, res) => {
    try {
        const { uid } = req.user;
        const { fcmToken } = req.body;

        if (!fcmToken) {
            return res.status(400).json({ message: 'FCM token is required' });
        }

        const userRef = db.collection('users').doc(uid);
        await userRef.update({ fcmToken });

        return res.status(200).json({ message: 'FCM token saved successfully' });
    } catch (error) {
        console.error('Error saving FCM token:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Example route to test sending a notification
const sendNotification = async (req, res) => {
    try {
        const { targetUid, title, body, data } = req.body;

        if (!targetUid || !title || !body) {
             return res.status(400).json({ message: 'targetUid, title, and body are required' });
        }

        const userRef = db.collection('users').doc(targetUid);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { fcmToken } = doc.data();

        if (!fcmToken) {
            return res.status(400).json({ message: 'User does not have an FCM token registered' });
        }

        const message = {
            notification: { title, body },
            data: data || {},
            token: fcmToken
        };

        const response = await messaging.send(message);
        return res.status(200).json({ message: 'Notification sent successfully', response });

    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { saveFcmToken, sendNotification };
