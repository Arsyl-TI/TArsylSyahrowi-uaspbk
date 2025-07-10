<template>
    <main id="riwayat-transaksi-page">
        <div class="orders-page">
            <div class="orders-container">
            <h1>Your Orders</h1>
            
            <!-- Order Filter -->
            <div class="order-filters">
                <div class="filter-group">
                <label>Filter by:</label>
                <select v-model="filterStatus" class="filter-select">
                    <option value="all">All Orders</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                </div>
                <div class="filter-group">
                <label>Time period:</label>
                <select v-model="filterPeriod" class="filter-select">
                    <option value="all">All Time</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="year">This Year</option>
                </select>
                </div>
            </div>

            <!-- Order List -->
            <div class="orders-list">
                <div v-if="filteredOrders.length === 0" class="no-orders">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="No orders">
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet</p>
                <router-link to="/produk" class="shop-btn">Start Shopping</router-link>
                </div>

                <div v-for="order in filteredOrders" :key="order.id" class="order-card">
                <div class="order-header">
                    <div class="order-meta">
                    <h3>Order #{{ order.id }}</h3>
                    <p class="order-date">Placed on {{ formatDate(order.date) }}</p>
                    <p class="order-total">Total: Rp {{ formatPrice(order.total) }}</p>
                    </div>
                    <div class="order-status" :class="getStatusClass(order.status)">
                    {{ formatStatus(order.status) }}
                    </div>
                </div>

                <div class="order-items-preview">
                    <div v-for="item in order.items.slice(0, 2)" :key="item.id" class="preview-item">
                    <img :src="item.image" :alt="item.name" class="item-image">
                    <div class="item-details">
                        <h4>{{ item.name }}</h4>
                        <p>Rp {{ formatPrice(item.price) }} × {{ item.quantity }}</p>
                    </div>
                    </div>
                    <div v-if="order.items.length > 2" class="more-items">
                    +{{ order.items.length - 2 }} more items
                    </div>
                </div>

                <div class="order-actions">
                    <router-link :to="`/orders/${order.id}`" class="view-details">
                    View Order Details
                    </router-link>
                    <button 
                    v-if="order.status === 'processing'" 
                    @click="cancelOrder(order.id)" 
                    class="cancel-order"
                    >
                    Cancel Order
                    </button>
                    <button 
                    v-if="order.status === 'delivered'" 
                    @click="requestReturn(order.id)" 
                    class="return-item"
                    >
                    Request Return
                    </button>
                    <button 
                    v-if="order.status === 'delivered' && !order.reviewed" 
                    @click="writeReview(order.id)" 
                    class="write-review"
                    >
                    Write Review
                    </button>
                </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="filteredOrders.length > 0" class="pagination">
                <button 
                @click="prevPage" 
                :disabled="currentPage === 1" 
                class="page-button"
                >
                Previous
                </button>
                <span class="page-info">
                Page {{ currentPage }} of {{ totalPages }}
                </span>
                <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages" 
                class="page-button"
                >
                Next
                </button>
            </div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
  name: 'OrdersPage',
  data() {
    return {
      filterStatus: 'all',
      filterPeriod: 'all',
      currentPage: 1,
      itemsPerPage: 5,
      orders: [
        {
          id: 'ORD-123456',
          date: '2023-06-15',
          status: 'delivered',
          reviewed: true,
          total: 4103000,
          items: [
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
            },
            {
              id: 3,
              name: 'Phone Case',
              price: 150000,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
          ]
        },
        {
          id: 'ORD-123455',
          date: '2023-06-10',
          status: 'shipped',
          reviewed: false,
          total: 1850000,
          items: [
            {
              id: 4,
              name: 'Wireless Earbuds',
              price: 850000,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: 5,
              name: 'USB-C Cable',
              price: 100000,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
          ]
        },
        {
          id: 'ORD-123454',
          date: '2023-05-28',
          status: 'processing',
          reviewed: false,
          total: 2750000,
          items: [
            {
              id: 6,
              name: 'Bluetooth Speaker',
              price: 650000,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: 7,
              name: 'Portable Charger',
              price: 350000,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
          ]
        },
        {
          id: 'ORD-123453',
          date: '2023-05-15',
          status: 'cancelled',
          reviewed: false,
          total: 1200000,
          items: [
            {
              id: 8,
              name: 'Fitness Tracker',
              price: 600000,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
          ]
        },
        {
          id: 'ORD-123452',
          date: '2023-04-05',
          status: 'delivered',
          reviewed: false,
          total: 950000,
          items: [
            {
              id: 9,
              name: 'Screen Protector',
              price: 150000,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: 10,
              name: 'Wireless Charger',
              price: 400000,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1587034861751-42996f06ca8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
          ]
        }
      ]
    }
  },
  computed: {
    filteredOrders() {
      let filtered = [...this.orders]
      
      // Apply status filter
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(order => order.status === this.filterStatus)
      }
      
      // Apply time period filter
      const now = new Date()
      if (this.filterPeriod !== 'all') {
        const days = parseInt(this.filterPeriod) || 365
        const cutoffDate = new Date(now.setDate(now.getDate() - days))
        filtered = filtered.filter(order => new Date(order.date) > cutoffDate)
      } else if (this.filterPeriod === 'year') {
        const yearStart = new Date(new Date().getFullYear(), 0, 1)
        filtered = filtered.filter(order => new Date(order.date) > yearStart)
      }
      
      // Apply pagination
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return filtered.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.orders.length / this.itemsPerPage)
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(price)
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    },
    formatStatus(status) {
      const statusMap = {
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
      }
      return statusMap[status] || status
    },
    getStatusClass(status) {
      return {
        'processing': 'status-processing',
        'shipped': 'status-shipped',
        'delivered': 'status-delivered',
        'cancelled': 'status-cancelled'
      }[status]
    },
    cancelOrder(orderId) {
      if (confirm('Are you sure you want to cancel this order?')) {
        const order = this.orders.find(o => o.id === orderId)
        if (order) {
          order.status = 'cancelled'
          alert('Order has been cancelled')
        }
      }
    },
    requestReturn(orderId) {
      this.$router.push(`/returns/new?order=${orderId}`)
    },
    writeReview(orderId) {
      this.$router.push(`/reviews/new?order=${orderId}`)
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    }
  }
}
</script>

<style scoped>
.orders-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 40px 20px;
}

.orders-container {
  max-width: 1200px;
  margin: 0 auto;
}

.orders-container h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 30px;
}

.order-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.no-orders {
  text-align: center;
  padding: 50px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.no-orders img {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.no-orders h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.no-orders p {
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

.order-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.order-meta h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 18px;
}

.order-date {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.order-total {
  margin: 5px 0 0 0;
  color: #2c3e50;
  font-weight: 500;
}

.order-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-processing {
  background: #fff4e5;
  color: #ff9800;
}

.status-shipped {
  background: #e3f2fd;
  color: #2196f3;
}

.status-delivered {
  background: #e8f5e9;
  color: #4caf50;
}

.status-cancelled {
  background: #ffebee;
  color: #f44336;
}

.order-items-preview {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.preview-item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.preview-item:last-child {
  margin-bottom: 0;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.item-details h4 {
  margin: 0 0 5px 0;
  font-size: 15px;
  color: #2c3e50;
}

.item-details p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}

.more-items {
  margin-top: 10px;
  font-size: 14px;
  color: #3498db;
}

.order-actions {
  display: flex;
  gap: 15px;
  padding: 20px;
  flex-wrap: wrap;
}

.view-details,
.cancel-order,
.return-item,
.write-review {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.view-details {
  background: white;
  border: 1px solid #3498db;
  color: #3498db;
  text-decoration: none;
}

.view-details:hover {
  background: #f0f7fd;
}

.cancel-order {
  background: white;
  border: 1px solid #e74c3c;
  color: #e74c3c;
}

.cancel-order:hover {
  background: #fdedec;
}

.return-item {
  background: white;
  border: 1px solid #f39c12;
  color: #f39c12;
}

.return-item:hover {
  background: #fef5e6;
}

.write-review {
  background: white;
  border: 1px solid #2ecc71;
  color: #2ecc71;
}

.write-review:hover {
  background: #e8f8f0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.page-button {
  padding: 8px 16px;
  background: white;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-button:hover:not(:disabled) {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #7f8c8d;
  font-size: 14px;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .order-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .view-details,
  .cancel-order,
  .return-item,
  .write-review {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .order-filters {
    flex-direction: column;
    gap: 10px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .pagination {
    gap: 10px;
  }
}
</style>