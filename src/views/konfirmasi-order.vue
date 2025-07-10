<template>
    <main id="konfirmasi-order-page">
        <div class="order-confirmation">
            <div class="confirmation-container">
            <!-- Order Confirmation Header -->
            <div class="confirmation-header">
                <div class="success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2ecc71">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                </div>
                <h1>Thank you for your order!</h1>
                <p class="order-number">Order #{{ order.id }}</p>
                <p class="confirmation-message">
                Your order has been received and is being processed. We've sent a confirmation email to
                <strong>{{ order.customer.email }}</strong>
                </p>
            </div>

            <!-- Order Summary -->
            <div class="order-summary">
                <h2>Order Summary</h2>
                
                <div class="summary-grid">
                <div class="summary-section">
                    <h3>Delivery Address</h3>
                    <p>{{ order.shipping.firstName }} {{ order.shipping.lastName }}</p>
                    <p>{{ order.shipping.address }}</p>
                    <p>{{ order.shipping.city }}, {{ order.shipping.postalCode }}</p>
                    <p>{{ order.shipping.country }}</p>
                    <p>Phone: {{ order.shipping.phone }}</p>
                </div>
                
                <div class="summary-section">
                    <h3>Shipping Method</h3>
                    <p>{{ order.shipping.method }}</p>
                    <p>Estimated delivery: {{ order.shipping.estimatedDelivery }}</p>
                </div>
                
                <div class="summary-section">
                    <h3>Payment Method</h3>
                    <div class="payment-method">
                    <img :src="getPaymentLogo(order.payment.method)" :alt="order.payment.method">
                    <span>{{ formatPaymentMethod(order.payment.method) }}</span>
                    </div>
                    <p v-if="order.payment.method === 'credit-card'">
                    Ending in {{ order.payment.cardLast4 }}
                    </p>
                </div>
                </div>
            </div>

            <!-- Order Items -->
            <div class="order-items">
                <h2>Your Items</h2>
                
                <div class="items-list">
                <div v-for="item in order.items" :key="item.id" class="order-item">
                    <div class="item-image">
                    <img :src="item.image" :alt="item.name">
                    <span class="quantity">{{ item.quantity }}</span>
                    </div>
                    <div class="item-details">
                    <h3>{{ item.name }}</h3>
                    <p v-if="item.variant">Variant: {{ item.variant }}</p>
                    </div>
                    <div class="item-price">
                    Rp {{ formatPrice(item.price * item.quantity) }}
                    </div>
                </div>
                </div>
            </div>

            <!-- Order Totals -->
            <div class="order-totals">
                <div class="total-row">
                <span>Subtotal</span>
                <span>Rp {{ formatPrice(order.totals.subtotal) }}</span>
                </div>
                <div class="total-row">
                <span>Shipping</span>
                <span>Rp {{ formatPrice(order.totals.shipping) }}</span>
                </div>
                <div class="total-row">
                <span>Tax</span>
                <span>Rp {{ formatPrice(order.totals.tax) }}</span>
                </div>
                <div class="total-row grand-total">
                <span>Total</span>
                <span>Rp {{ formatPrice(order.totals.total) }}</span>
                </div>
            </div>

            <!-- Order Actions -->
            <div class="order-actions">
                <router-link to="/produk" class="continue-shopping">
                Continue Shopping
                </router-link>
                <router-link to="/riwayat-transaksi" class="view-orders">
                View My Orders
                </router-link>
            </div>

            <!-- Help Section -->
            <div class="help-section">
                <h3>Need help with your order?</h3>
                <p>Contact our customer support team at <a href="mailto:support@example.com">support@example.com</a> or call +62 123 4567 890</p>
            </div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
  name: 'OrderConfirmation',
  data() {
    return {
      order: {
        id: 'ORD-' + Math.floor(Math.random() * 1000000),
        date: new Date().toISOString(),
        customer: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        },
        shipping: {
          firstName: 'John',
          lastName: 'Doe',
          address: 'Jl. Sudirman No. 123',
          city: 'Jakarta',
          postalCode: '10220',
          country: 'Indonesia',
          phone: '+6281234567890',
          method: 'Express Shipping',
          estimatedDelivery: 'June 15, 2023'
        },
        payment: {
          method: 'gopay',
          cardLast4: '1234'
        },
        items: [
          {
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            price: 1200000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            variant: 'Black'
          },
          {
            id: 2,
            name: 'Smart Watch Pro',
            price: 2500000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            variant: '42mm, Black'
          }
        ],
        totals: {
          subtotal: 3700000,
          shipping: 30000,
          tax: 373000,
          total: 4103000
        }
      }
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(price)
    },
    getPaymentLogo(method) {
      const logos = {
        'credit-card': 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
        'bank-transfer': 'https://cdn-icons-png.flaticon.com/512/2331/2331895.png',
        'gopay': 'https://cdn-icons-png.flaticon.com/512/2504/2504903.png',
        'ovo': 'https://cdn-icons-png.flaticon.com/512/2504/2504920.png'
      }
      return logos[method] || logos['credit-card']
    },
    formatPaymentMethod(method) {
      const names = {
        'credit-card': 'Credit Card',
        'bank-transfer': 'Bank Transfer',
        'gopay': 'GoPay',
        'ovo': 'OVO'
      }
      return names[method] || method
    }
  }
}
</script>

<style scoped>
.order-confirmation {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 40px 20px;
}

.confirmation-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  padding: 40px;
}

.confirmation-header {
  text-align: center;
  margin-bottom: 40px;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background-color: #e8f8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon svg {
  width: 40px;
  height: 40px;
}

.confirmation-header h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.order-number {
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 15px;
}

.confirmation-message {
  font-size: 16px;
  color: #34495e;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.order-summary {
  margin-bottom: 30px;
}

.order-summary h2 {
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.summary-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-section h3 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 15px;
}

.summary-section p {
  margin: 8px 0;
  color: #34495e;
  font-size: 14px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.payment-method img {
  width: 30px;
  height: 20px;
  object-fit: contain;
}

.order-items {
  margin-bottom: 30px;
}

.order-items h2 {
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.items-list {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  position: relative;
  width: 80px;
  height: 80px;
  margin-right: 20px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.item-image .quantity {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.item-details p {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.item-price {
  font-weight: bold;
  color: #2c3e50;
  min-width: 100px;
  text-align: right;
}

.order-totals {
  max-width: 400px;
  margin-left: auto;
  margin-bottom: 40px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #2c3e50;
}

.total-row.grand-total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-size: 18px;
  font-weight: bold;
}

.order-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.continue-shopping,
.view-orders {
  padding: 12px 25px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.continue-shopping {
  background: white;
  border: 1px solid #3498db;
  color: #3498db;
}

.continue-shopping:hover {
  background: #f0f7fd;
}

.view-orders {
  background: #3498db;
  border: 1px solid #3498db;
  color: white;
}

.view-orders:hover {
  background: #2980b9;
}

.help-section {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
}

.help-section h3 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.help-section p {
  color: #7f8c8d;
  margin: 0;
}

.help-section a {
  color: #3498db;
  text-decoration: none;
}

.help-section a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .confirmation-container {
    padding: 30px 20px;
  }
  
  .order-item {
    flex-wrap: wrap;
  }
  
  .item-price {
    width: 100%;
    text-align: left;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px dashed #eee;
  }
  
  .order-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .continue-shopping,
  .view-orders {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .confirmation-header h1 {
    font-size: 24px;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .order-totals {
    max-width: 100%;
  }
}
</style>