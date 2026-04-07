// Backend/controllers/orderController.js
const { db, messaging } = require('../config/firebase'); // Use the shared db and messaging instance
const Order = require('../models/Order');

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const docRef = await db.collection('orders').add(newOrder.toFirestore());
    
    // Send Notification to Seller
    if (newOrder.sellerId && messaging) {
      try {
        const sellerDoc = await db.collection('users').doc(newOrder.sellerId).get();
        if (sellerDoc.exists) {
          const fcmToken = sellerDoc.data().fcmToken;
          if (fcmToken) {
            const message = {
              notification: {
                title: 'New Product Request',
                body: `A buyer has requested ${newOrder.productName || 'a product'} from you.`
              },
              data: {
                orderId: docRef.id,
                type: 'NEW_ORDER_REQUEST'
              },
              token: fcmToken
            };
            await messaging.send(message);
            console.log(`Notification sent to seller ${newOrder.sellerId} for order ${docRef.id}`);
          }
        }
      } catch (notifErr) {
        console.error('Error sending order request notification to seller:', notifErr);
      }
    }

    res.status(201).json({ 
      message: 'Order created successfully', 
      orderId: docRef.id 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// GET /api/orders/seller
exports.getSellerOrders = async (req, res) => {
  try {
    // In a real app, you'd get the sellerId from auth middleware (req.user.id)
    // For the MVP, we can pass it as a query parameter: ?sellerId=123
    const sellerId = req.query.sellerId; 

    if (!sellerId) return res.status(400).json({ error: 'Seller ID required' });

    const ordersSnapshot = await db.collection('orders')
      .where('sellerId', '==', sellerId)
      .where('status', 'in', ['pending', 'accepted', 'rejected'])
      .get();

    const orders = [];
    ordersSnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// PUT /api/orders/:id/respond
exports.respondToOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { response, quantity, price } = req.body; // response = 'yes'|'no', quantity + price from seller

    if (!['yes', 'no'].includes(response)) {
      return res.status(400).json({ error: "Response must be 'yes' or 'no'" });
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderDoc.data();
    const newStatus = response === 'yes' ? 'accepted' : 'rejected';

    const updateData = { status: newStatus, respondedAt: new Date().toISOString() };
    // If seller accepted, also save their confirmed price and quantity
    if (response === 'yes') {
      if (quantity) updateData.quantity = quantity;
      if (price) updateData.price = price;
    }

    await orderRef.update(updateData);

    // Send Notification to Buyer
    if (messaging) {
      try {
        const buyerId = orderData.buyerId;
        const productName = orderData.productName || 'a product';
        const finalPrice = price || orderData.price;
        
        const buyerDoc = await db.collection('users').doc(buyerId).get();
        if (buyerDoc.exists) {
          const fcmToken = buyerDoc.data().fcmToken;
          if (fcmToken) {
            let notificationPayload = {};
            if (response === 'yes') {
              notificationPayload = {
                title: 'Request Accepted!',
                body: `A seller has accepted your request for ${productName}${finalPrice ? ' at ₹' + finalPrice : ''}.`
              };
            } else {
              notificationPayload = {
                title: 'Sold Out',
                body: `Sorry, the seller just marked ${productName} as currently unavailable.`
              };
            }

            const message = {
              notification: notificationPayload,
              data: {
                orderId: orderId,
                type: response === 'yes' ? 'ORDER_ACCEPTED' : 'ORDER_REJECTED'
              },
              token: fcmToken
            };
            await messaging.send(message);
            console.log(`Notification sent to buyer ${buyerId} for order ${orderId} (${response})`);
          }
        }
      } catch (notifErr) {
        console.error('Error sending order response notification:', notifErr);
      }
    }

    res.status(200).json({ 
      message: `Order status updated to ${newStatus}`,
      status: newStatus
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// GET /api/orders/:id (for buyer to check if seller accepted)
exports.getOrderById = async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// GET /api/orders/buyer
exports.getBuyerOrders = async (req, res) => {
  try {
    const buyerId = req.query.buyerId; 
    if (!buyerId) return res.status(400).json({ error: 'Buyer ID required' });

    const ordersSnapshot = await db.collection('orders')
      .where('buyerId', '==', buyerId)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = [];
    ordersSnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ error: 'Failed to fetch buyer orders' });
  }
};
// DELETE /api/orders/:id
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    await db.collection('orders').doc(orderId).delete();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};