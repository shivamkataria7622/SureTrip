const port =require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/authRoutes');
const firebase = require('./config/firebase');
const app = express();
const PORT = process.env.PORT || 5000;
const orderRoutes = require('./routes/orderRoutes');


// Middleware
app.use(cors());
app.use(express.json());

// Routes will be added here
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('SureTrip Backend is running!');
});

// Check database connection before starting the server
if (firebase.db) {
    // Perform a lightweight query to verify the connection
    firebase.db.listCollections()
        .then(() => {
            console.log('Firebase connection verified.');
            app.listen(PORT, '0.0.0.0', () => {
                console.log(`Server started on http://0.0.0.0:${PORT}`);
            });
        })
        .catch((error) => {
            console.error('Failed to verify Firebase connection:', error.message);
            process.exit(1);
        });
} else {
    console.error('Firebase Admin not initialized properly. Database connection failed.');
    process.exit(1);
}
