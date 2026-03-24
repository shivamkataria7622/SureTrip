

// Backend/models/Order.js

class Order {
  constructor({ buyerId, sellerId, productName, price, quantity }) {
    this.buyerId = buyerId;
    this.sellerId = sellerId;
    this.productName = productName;
    this.status = 'pending'; // Default status on creation
    this.price = price;
    this.quantity = quantity;
    this.createdAt = new Date().toISOString();
  }

  // Helper to format data for Firestore
  toFirestore() {
    return {
      buyerId: this.buyerId,
      sellerId: this.sellerId,
      productName: this.productName,
      status: this.status,
      price: this.price,
      quantity: this.quantity,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Order;