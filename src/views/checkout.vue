<script>
// src/views/checkout.vue
export default {
  name: 'CheckoutPage',
  data() {
    return {
      currentStep: 1,
      isProcessing: false,
      shippingInfo: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: ''
      },
      shippingMethods: [
        { id: 'standard', name: 'Standard Shipping', price: 15000, duration: '3-5 business days' },
        { id: 'express', name: 'Express Shipping', price: 30000, duration: '1-2 business days' },
        { id: 'same-day', name: 'Same Day Delivery', price: 50000, duration: 'Today' }
      ],
      selectedShippingMethod: 'standard',
      paymentMethods: [
        { id: 'credit-card', name: 'Credit Card', logo: 'https://cdn-icons-png.flaticon.com/512/196/196578.png' },
        { id: 'bank-transfer', name: 'Bank Transfer', logo: 'https://cdn-icons-png.flaticon.com/512/2331/2331895.png' },
        { id: 'gopay', name: 'GoPay', logo: 'https://cdn-icons-png.flaticon.com/512/2504/2504903.png' },
        { id: 'ovo', name: 'OVO', logo: 'https://cdn-icons-png.flaticon.com/512/2504/2504920.png' }
      ],
      selectedPaymentMethod: 'credit-card',
      paymentInfo: {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: ''
      },
      cartItems: [
        {
          id: 1,
          name: 'Wireless Bluetooth Headphones',
          price: 1200000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 2,
          name: 'Smart Watch Pro',
          price: 2500000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      ]
    }
  },
  computed: {
    selectedShippingMethodObj() {
      return this.shippingMethods.find(method => method.id === this.selectedShippingMethod) || {}
    },
    selectedPaymentMethodObj() {
      return this.paymentMethods.find(method => method.id === this.selectedPaymentMethod) || {}
    },
    subtotal() {
      return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    tax() {
      return this.subtotal * 0.1 // 10% tax
    },
    total() {
      return this.subtotal + this.selectedShippingMethodObj.price + this.tax
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(price)
    },
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    formatCardNumber() {
      // Remove all non-digit characters
      let value = this.paymentInfo.cardNumber.replace(/\D/g, '')
      
      // Add space after every 4 digits
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
      
      // Limit to 16 digits (4 groups of 4)
      value = value.substring(0, 19)
      
      this.paymentInfo.cardNumber = value
    },
    formatExpiryDate() {
      // Remove all non-digit characters
      let value = this.paymentInfo.expiryDate.replace(/\D/g, '')
      
      // Add slash after 2 digits (MM/YY)
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4)
      }
      
      this.paymentInfo.expiryDate = value
    },
    placeOrder() {
      this.isProcessing = true
      
      // Simulate API call
      setTimeout(() => {
        this.isProcessing = false
        this.$router.push('/keranjang/checkout/konfirmasi-order')
      }, 2000)
    }
  }
}
</script>

<template>
    <main id="checkout">
        <div class="checkout-container">
            <div class="checkout-header">
            <h1>Checkout</h1>
            <div class="checkout-steps">
                <div class="step active">1. Shipping</div>
                <div class="step" :class="{ active: currentStep > 1 }">2. Payment</div>
                <div class="step" :class="{ active: currentStep > 2 }">3. Review</div>
            </div>
            </div>

            <div class="checkout-content">
            <!-- Shipping Step -->
            <div v-if="currentStep === 1" class="checkout-step shipping-step">
                <h2>Shipping Information</h2>
                
                <div class="form-row">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input type="text" id="firstName" v-model="shippingInfo.firstName" required>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input type="text" id="lastName" v-model="shippingInfo.lastName" required>
                </div>
                </div>
                
                <div class="form-group">
                <label for="address">Address</label>
                <input type="text" id="address" v-model="shippingInfo.address" required>
                </div>
                
                <div class="form-row">
                <div class="form-group">
                    <label for="city">City</label>
                    <input type="text" id="city" v-model="shippingInfo.city" required>
                </div>
                <div class="form-group">
                    <label for="postalCode">Postal Code</label>
                    <input type="text" id="postalCode" v-model="shippingInfo.postalCode" required>
                </div>
                </div>
                
                <div class="form-group">
                <label for="country">Country</label>
                <select id="country" v-model="shippingInfo.country" required>
                    <option value="">Select Country</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Thailand">Thailand</option>
                </select>
                </div>
                
                <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" v-model="shippingInfo.phone" required>
                </div>
                
                <div class="shipping-methods">
                <h3>Shipping Method</h3>
                <div class="method" v-for="method in shippingMethods" :key="method.id">
                    <input 
                    type="radio" 
                    :id="'method-' + method.id" 
                    :value="method.id" 
                    v-model="selectedShippingMethod"
                    >
                    <label :for="'method-' + method.id">
                    <span class="method-name">{{ method.name }}</span>
                    <span class="method-price">Rp {{ formatPrice(method.price) }}</span>
                    <span class="method-duration">{{ method.duration }}</span>
                    </label>
                </div>
                </div>
                
                <div class="step-actions">
                <button @click="nextStep" class="continue-btn">Continue to Payment</button>
                </div>
            </div>

            <!-- Payment Step -->
            <div v-if="currentStep === 2" class="checkout-step payment-step">
                <h2>Payment Method</h2>
                
                <div class="payment-methods">
                <div class="method" v-for="method in paymentMethods" :key="method.id">
                    <input 
                    type="radio" 
                    :id="'payment-' + method.id" 
                    :value="method.id" 
                    v-model="selectedPaymentMethod"
                    >
                    <label :for="'payment-' + method.id">
                    <img :src="method.logo" :alt="method.name" class="method-logo">
                    <span class="method-name">{{ method.name }}</span>
                    </label>
                </div>
                </div>
                
                <div v-if="selectedPaymentMethod === 'credit-card'" class="credit-card-form">
                <div class="form-group">
                    <label for="cardNumber">Card Number</label>
                    <input 
                    type="text" 
                    id="cardNumber" 
                    v-model="paymentInfo.cardNumber" 
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    @input="formatCardNumber"
                    >
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                    <label for="expiryDate">Expiry Date</label>
                    <input 
                        type="text" 
                        id="expiryDate" 
                        v-model="paymentInfo.expiryDate" 
                        placeholder="MM/YY"
                        maxlength="5"
                        @input="formatExpiryDate"
                    >
                    </div>
                    <div class="form-group">
                    <label for="cvv">CVV</label>
                    <input 
                        type="text" 
                        id="cvv" 
                        v-model="paymentInfo.cvv" 
                        placeholder="123"
                        maxlength="3"
                    >
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="cardName">Name on Card</label>
                    <input type="text" id="cardName" v-model="paymentInfo.cardName">
                </div>
                </div>
                
                <div class="step-actions">
                <button @click="prevStep" class="back-btn">Back</button>
                <button @click="nextStep" class="continue-btn">Review Order</button>
                </div>
            </div>

            <!-- Review Step -->
            <div v-if="currentStep === 3" class="checkout-step review-step">
                <h2>Review Your Order</h2>
                
                <div class="order-summary">
                <div class="shipping-review">
                    <h3>Shipping Information</h3>
                    <p>{{ shippingInfo.firstName }} {{ shippingInfo.lastName }}</p>
                    <p>{{ shippingInfo.address }}</p>
                    <p>{{ shippingInfo.city }}, {{ shippingInfo.postalCode }}</p>
                    <p>{{ shippingInfo.country }}</p>
                    <p>Phone: {{ shippingInfo.phone }}</p>
                    
                    <h3>Shipping Method</h3>
                    <p>{{ selectedShippingMethodObj.name }} ({{ selectedShippingMethodObj.duration }})</p>
                </div>
                
                <div class="payment-review">
                    <h3>Payment Method</h3>
                    <div class="payment-method">
                    <img :src="selectedPaymentMethodObj.logo" :alt="selectedPaymentMethodObj.name">
                    <span>{{ selectedPaymentMethodObj.name }}</span>
                    </div>
                    
                    <div v-if="selectedPaymentMethod === 'credit-card'" class="card-info">
                    <p>Card ending in {{ paymentInfo.cardNumber.slice(-4) }}</p>
                    <p>Expires {{ paymentInfo.expiryDate }}</p>
                    </div>
                </div>
                
                <div class="order-items">
                    <h3>Order Items</h3>
                    <div class="item" v-for="item in cartItems" :key="item.id">
                    <div class="item-image">
                        <img :src="item.image" :alt="item.name">
                    </div>
                    <div class="item-details">
                        <h4>{{ item.name }}</h4>
                        <p>Rp {{ formatPrice(item.price) }} × {{ item.quantity }}</p>
                    </div>
                    <div class="item-total">
                        Rp {{ formatPrice(item.price * item.quantity) }}
                    </div>
                    </div>
                </div>
                </div>
                
                <div class="order-totals">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>Rp {{ formatPrice(subtotal) }}</span>
                </div>
                <div class="total-row">
                    <span>Shipping</span>
                    <span>Rp {{ formatPrice(selectedShippingMethodObj.price) }}</span>
                </div>
                <div class="total-row">
                    <span>Tax (10%)</span>
                    <span>Rp {{ formatPrice(tax) }}</span>
                </div>
                <div class="total-row grand-total">
                    <span>Total</span>
                    <span>Rp {{ formatPrice(total) }}</span>
                </div>
                </div>
                
                <div class="step-actions">
                <button @click="prevStep" class="back-btn">Back</button>
                <button @click="placeOrder" class="place-order-btn" :disabled="isProcessing">
                    <span v-if="!isProcessing">Place Order</span>
                    <span v-else class="spinner"></span>
                </button>
                </div>
            </div>
            </div>

            <!-- Order Summary Sidebar -->
            <div class="order-summary-sidebar">
            <h3>Order Summary</h3>
            
            <div class="order-items">
                <div class="item" v-for="item in cartItems" :key="item.id">
                <div class="item-image">
                    <img :src="item.image" :alt="item.name">
                    <span class="quantity">{{ item.quantity }}</span>
                </div>
                <div class="item-details">
                    <h4>{{ item.name }}</h4>
                    <p>Rp {{ formatPrice(item.price) }}</p>
                </div>
                </div>
            </div>
            
            <div class="order-totals">
                <div class="total-row">
                <span>Subtotal</span>
                <span>Rp {{ formatPrice(subtotal) }}</span>
                </div>
                <div class="total-row" v-if="currentStep > 1">
                <span>Shipping</span>
                <span>Rp {{ formatPrice(selectedShippingMethodObj.price) }}</span>
                </div>
                <div class="total-row" v-if="currentStep > 1">
                <span>Tax (10%)</span>
                <span>Rp {{ formatPrice(tax) }}</span>
                </div>
                <div class="total-row grand-total" v-if="currentStep > 1">
                <span>Total</span>
                <span>Rp {{ formatPrice(total) }}</span>
                </div>
            </div>
            
            <router-link to="/keranjang" class="edit-cart-link">Edit Cart</router-link>
            </div>
        </div>
    </main>
</template>

<style scoped>
.checkout-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Arial', sans-serif;
  gap: 40px;
}

.checkout-header {
  width: 100%;
  margin-bottom: 30px;
}

.checkout-header h1 {
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 20px;
}

.checkout-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.checkout-steps::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e0e0e0;
  z-index: 1;
}

.step {
  position: relative;
  z-index: 2;
  background: #f8f9fa;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  color: #7f8c8d;
}

.step.active {
  background: #3498db;
  color: white;
}

.checkout-content {
  flex: 2;
}

.checkout-step {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.checkout-step h2 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 22px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.shipping-methods,
.payment-methods {
  margin: 30px 0;
}

.shipping-methods h3,
.payment-methods h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #2c3e50;
}

.method {
  margin-bottom: 10px;
}

.method input[type="radio"] {
  display: none;
}

.method label {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.method input[type="radio"]:checked + label {
  border-color: #3498db;
  background-color: #f0f7fd;
}

.method-name {
  flex: 1;
  font-weight: 500;
}

.method-price {
  margin: 0 15px;
  font-weight: bold;
  color: #e74c3c;
}

.method-duration {
  color: #7f8c8d;
  font-size: 13px;
}

.method-logo {
  width: 30px;
  height: 20px;
  object-fit: contain;
  margin-right: 15px;
}

.credit-card-form {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.back-btn {
  padding: 12px 25px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #f5f5f5;
}

.continue-btn,
.place-order-btn {
  padding: 12px 25px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.continue-btn:hover,
.place-order-btn:hover:not(:disabled) {
  background: #27ae60;
}

.place-order-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.order-summary-sidebar {
  flex: 1;
  position: sticky;
  top: 30px;
  height: fit-content;
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.order-summary-sidebar h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 18px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.order-items .item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.order-items .item:last-child {
  border-bottom: none;
}

.order-items .item-image {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.order-items .item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.order-items .item-image .quantity {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.order-items .item-details {
  flex: 1;
}

.order-items .item-details h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #2c3e50;
}

.order-items .item-details p {
  margin: 0;
  font-size: 13px;
  color: #7f8c8d;
}

.order-totals {
  margin-top: 20px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #2c3e50;
}

.total-row.grand-total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-weight: bold;
  font-size: 16px;
}

.edit-cart-link {
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #3498db;
  text-decoration: none;
  font-size: 14px;
}

.edit-cart-link:hover {
  text-decoration: underline;
}

.review-step .order-summary {
  margin-bottom: 30px;
}

.review-step h3 {
  color: #2c3e50;
  margin: 25px 0 15px 0;
  font-size: 18px;
}

.review-step p {
  margin: 5px 0;
  color: #34495e;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.payment-method img {
  width: 30px;
  height: 20px;
  object-fit: contain;
}

.card-info p {
  margin: 5px 0 5px 40px;
  font-size: 14px;
  color: #7f8c8d;
}

.order-items .item-total {
  font-weight: bold;
  color: #2c3e50;
}

@media (max-width: 992px) {
  .checkout-container {
    flex-direction: column;
  }
  
  .order-summary-sidebar {
    order: -1;
    margin-bottom: 30px;
    position: static;
  }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .checkout-step {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .checkout-steps .step {
    font-size: 12px;
    padding: 6px 10px;
  }
  
  .method label {
    flex-wrap: wrap;
  }
  
  .method-price {
    margin: 5px 0;
    width: 100%;
  }
}
</style>