// Backend/controllers/orderController.js
const { db } = require('../config/firebase'); // Use the shared db instance (already initialized with credentials)
const Order = require('../models/Order');

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const docRef = await db.collection('orders').add(newOrder.toFirestore());
    
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
      .where('status', 'in', ['pending', 'accepted'])
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

    const newStatus = response === 'yes' ? 'accepted' : 'rejected';

    const updateData = { status: newStatus, respondedAt: new Date().toISOString() };
    // If seller accepted, also save their confirmed price and quantity
    if (response === 'yes') {
      if (quantity) updateData.quantity = quantity;
      if (price) updateData.price = price;
    }

    await db.collection('orders').doc(orderId).update(updateData);

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