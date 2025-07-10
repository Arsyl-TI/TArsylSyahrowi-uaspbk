<template>
	<main id="keranjang-page">
        <div class="cart-container">
        <div class="cart-header">
        <h1>Keranjang kamu</h1>
        <p v-if="cartItems.length > 0">{{ cartItems.length }} barang di keranjang</p>
        </div>

        <div class="cart-content">
        <div class="cart-items" v-if="cartItems.length > 0">
            <div class="cart-item" v-for="(item, index) in cartItems" :key="item.id">
            <div class="item-image">
                <img :src="item.image" :alt="item.name" />
            </div>
            <div class="item-details">
                <h3>{{ item.name }}</h3>
                <p class="item-description">{{ item.description }}</p>
                <p class="item-price">Rp {{ formatPrice(item.price) }}</p>
                
                <div class="item-actions">
                <div class="quantity-control">
                    <button 
                    @click="decreaseQuantity(index)" 
                    :disabled="item.quantity <= 1"
                    class="quantity-btn"
                    >
                    -
                    </button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button 
                    @click="increaseQuantity(index)" 
                    class="quantity-btn"
                    >
                    +
                    </button>
                </div>
                
                <button @click="removeItem(index)" class="remove-btn">
                    Remove
                </button>
                </div>
            </div>
            </div>
        </div>

        <div class="empty-cart" v-else>
            <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty cart" />
            <h3>Keranjang Kosong</h3>
            <p>Sepertinya Kamu Belum menambahkan Barang</p>
            <router-link to="/produk" class="shop-btn">Lanjut Belanja</router-link>
        </div>

        <div class="cart-summary" v-if="cartItems.length > 0">
            <div class="summary-card">
            <h3>Order Summary</h3>
            
            <div class="summary-row">
                <span>total</span>
                <span>Rp {{ formatPrice(subtotal) }}</span>
            </div>
            
            <div class="summary-row">
                <span>Ongkir</span>
                <span>{{ shippingCost === 0 ? 'Free' : `Rp ${formatPrice(shippingCost)}` }}</span>
            </div>
            
            <div class="summary-row">
                <span>Pajak (10%)</span>
                <span>Rp {{ formatPrice(tax) }}</span>
            </div>
            
            <div class="summary-row total">
                <span>Total</span>
                <span>Rp {{ formatPrice(total) }}</span>
            </div>
            
            <button 
                @click="proceedToCheckout" 
                class="checkout-btn"
                :disabled="isProcessing"
            >
                <span v-if="!isProcessing">Proceed to Checkout</span>
                <span v-else class="spinner"></span>
            </button>
            
            <router-link to="/produk" class="continue-shopping">
                Lanjut Belanja
            </router-link>
            </div>
        </div>
        </div>
    </div>
	</main>
</template>

<script>
export default {
  name: 'ShoppingCart',
  data() {
    return {
      cartItems: [
        {
          id: 1,
          name: 'Wireless Bluetooth Headphones',
          description: 'High-quality sound with noise cancellation',
          price: 1200000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 2,
          name: 'Smart Watch Pro',
          description: 'Fitness tracker with heart rate monitor',
          price: 2500000,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 3,
          name: 'Portable Bluetooth Speaker',
          description: 'Waterproof with 20hrs battery life',
          price: 850000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      ],
      shippingCost: 15000,
      isProcessing: false
    }
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    tax() {
      return this.subtotal * 0.1 // 10% tax
    },
    total() {
      return this.subtotal + this.shippingCost + this.tax
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(price)
    },
    increaseQuantity(index) {
      this.cartItems[index].quantity++
    },
    decreaseQuantity(index) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--
      }
    },
    removeItem(index) {
      this.cartItems.splice(index, 1)
    },
    proceedToCheckout() {
      this.isProcessing = true
      
      // Simulate API call
      setTimeout(() => {
        this.isProcessing = false
        this.$router.push('/keranjang/checkout')
      }, 1500)
    }
  }
}
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Arial', sans-serif;
}

.cart-header {
  text-align: center;
  margin-bottom: 40px;
}

.cart-header h1 {
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 10px;
}

.cart-header p {
  color: #7f8c8d;
  font-size: 16px;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.cart-item:hover {
  transform: translateY(-3px);
}

.item-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 18px;
}

.item-description {
  margin: 0 0 12px 0;
  color: #7f8c8d;
  font-size: 14px;
}

.item-price {
  margin: 0 0 15px 0;
  color: #e74c3c;
  font-weight: bold;
  font-size: 16px;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.quantity-btn:hover {
  background: #f5f5f5;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 20px;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  padding: 5px;
}

.remove-btn:hover {
  color: #c0392b;
}

.empty-cart {
  text-align: center;
  padding: 50px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-cart img {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-cart h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-cart p {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.shop-btn {
  display: inline-block;
  padding: 12px 24px;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.3s;
}

.shop-btn:hover {
  background: #2980b9;
}

.cart-summary {
  margin-top: 20px;
}

.summary-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.summary-card h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #2c3e50;
}

.summary-row.total {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-weight: bold;
  font-size: 18px;
}

.checkout-btn {
  width: 100%;
  padding: 14px;
  margin-top: 25px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.checkout-btn:hover {
  background: #27ae60;
}

.checkout-btn:disabled {
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

.continue-shopping {
  display: block;
  text-align: center;
  margin-top: 15px;
  color: #3498db;
  text-decoration: none;
  font-size: 14px;
}

.continue-shopping:hover {
  text-decoration: underline;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
  }
  
  .item-image {
    width: 100%;
    height: 200px;
  }
  
  .item-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .cart-header h1 {
    font-size: 24px;
  }
  
  .summary-card {
    padding: 20px 15px;
  }
}
</style>