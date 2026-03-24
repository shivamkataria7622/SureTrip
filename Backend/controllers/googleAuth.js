

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const auth_google = async (req, res) => {
const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        // Verify the ID token 
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  
        });

        // Extract the user payload (contains email, name, picture, etc.)
        const payload = ticket.getPayload();
        const userid = payload['sub']; // The unique Google User ID

        // At this point, the token is valid. 
        // You can now safely proxy the request or return access to your backend resources.
        console.log(`Verified user: ${payload.email}`);

        res.status(200).json({ 
            message: 'Token verified successfully',
            user: {
                id: userid,
                email: payload.email,
                name: payload.name
            }
        });

    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
const auth_firebase = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }
        const decodedToken = await admin.auth().verifyIdToken(token);
      
        const email = decodedToken.email;
        const name = decodedToken.name;
     
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();
        if (!doc.exists) {
            await userRef.set({
                uid,
                email,
                name,
             
                createdAt: new Date().toISOString(),
                fcmToken: '',
                loginProviders: decodedToken.firebase.sign_in_provider
            });
            return res.status(201).json({ message: 'User profile created successfully' });
        } else {
            await userRef.update({
                lastLoginAt: new Date().toISOString(),
            });
            return res.status(200).json({ message: 'User profile synchronized', user: doc.data() });
        }
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
    module.exports.auth_google = auth_google;
    module.exports.auth_firebase = auth_firebase;