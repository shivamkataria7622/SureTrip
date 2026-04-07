// Backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/seller', orderController.getSellerOrders);
router.get('/:id', orderController.getOrderById);     // buyer polls for seller response
router.get('/buyer', orderController.getBuyerOrders); // get all orders for a buyer
router.put('/:id/respond', orderController.respondToOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;