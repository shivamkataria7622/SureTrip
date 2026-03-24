const admin = require('firebase-admin');

// IMPORTANT: Put your Firebase service account JSON file in this 'config' folder
// Make sure to NEVER commit this file to public version control!
let db, auth, messaging;

try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized successfully.");
    db = admin.firestore();
    auth = admin.auth();
    messaging = admin.messaging();
} catch (error) {
    console.error("Firebase Admin initialization error:", error.message);
    console.error("Please ensure you have placed the serviceAccountKey.json file in the config folder.");
    // Mock them or let them be undefined, but don't crash the server on startup.
}

module.exports = { admin, db, auth, messaging };
