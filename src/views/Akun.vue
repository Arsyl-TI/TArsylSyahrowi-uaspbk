<script>
// src/views/Akun.vue
import { useUserStore } from '@/stores/userStore'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import transactionsData from '@/assets/transactions.json'

export default {
  name: 'UserProfile',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    onMounted(() => {
      if (!userStore.isAuthenticated) {
        router.push('/login')
      }
    })
    return { userStore }
    
  },
  data() {
    return {
      transactions: transactionsData,
      filters: ['All', 'Income', 'Expense'],
      activeFilter: 'All'
    }
  },
  computed: {
    filteredTransactions() {
      if (this.activeFilter === 'Income') {
        return this.transactions.filter(t => t.type === 'credit');
      } else if (this.activeFilter === 'Expense') {
        return this.transactions.filter(t => t.type === 'debit');
      }
      return this.transactions;
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID').format(value);
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    }
  }
  
}
</script>

<template>
	<main id="akun-page">
    <div class="profile-container">

      
      <div class="profile-info">
        <div class="avatar">
          <img :src="userStore.user.avatar" alt="User Avatar" class="avatar-img">
        </div>
        
        <div class="user-details">
          <h2>{{ userStore.user.name }}</h2>
          <p class="username">@{{ userStore.user.username }}</p>
          <p class="email">{{ userStore.user.email }}</p>
          <p class="description">{{ userStore.user.description }}</p>
          
          <div class="balance">
            <h3>Current Balance</h3>
            <p class="amount">Rp {{ formatCurrency(userStore.user.balance) }}</p>
          </div>
        </div>

        
        <div class="transaction-history">
          <h2>Transaction History</h2>
          
          <div class="transaction-filters">
            <button 
              v-for="filter in filters" 
              :key="filter" 
              @click="activeFilter = filter"
              :class="{ active: activeFilter === filter }"
            >
              {{ filter }}
            </button>
          </div>
          
          <div class="transactions">
            <div 
              v-for="transaction in filteredTransactions" 
              :key="transaction.id" 
              class="transaction-item"
              :class="{ credit: transaction.type === 'credit', debit: transaction.type === 'debit' }"
            >
              <div class="transaction-info">
                <h4>{{ transaction.description }}</h4>
                <p class="date">{{ formatDate(transaction.date) }}</p>
              </div>
              <div class="transaction-amount">
                <span v-if="transaction.type === 'credit'">↑</span>
                <span v-else>↓</span>
                Rp {{ formatCurrency(transaction.amount) }}
              </div>
            </div>
            
            <div v-if="filteredTransactions.length === 0" class="no-transactions">
              No transactions found
            </div>
          </div>
        </div>
      </div>
    </div>
	</main>
</template>

<style>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.profile-info {
  display: flex;
  gap: 30px;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.avatar-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.username {
  color: #666;
  margin: 5px 0;
}

.email {
  color: #007bff;
  margin: 10px 0;
}

.description {
  color: #555;
  line-height: 1.5;
  margin: 15px 0;
}

.balance {
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #e9f7ef, #d4edda);
  border-radius: 8px;
}

.balance h3 {
  margin: 0 0 10px 0;
  color: #28a745;
}

.amount {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #28a745;
}

.transaction-history {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.transaction-filters {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.transaction-filters button {
  padding: 8px 15px;
  border: none;
  background: #e0e0e0;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.transaction-filters button.active {
  background: #007bff;
  color: white;
}

.transactions {
  margin-top: 20px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.transaction-item:hover {
  transform: translateX(5px);
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.transaction-item.credit {
  border-left: 4px solid #28a745;
}

.transaction-item.debit {
  border-left: 4px solid #dc3545;
}

.transaction-info h4 {
  margin: 0 0 5px 0;
}

.transaction-info .date {
  margin: 0;
  color: #666;
  font-size: 0.9em;
}

.transaction-amount {
  font-weight: bold;
}

.transaction-amount span {
  margin-right: 5px;
  font-weight: bold;
}

.transaction-item.credit .transaction-amount {
  color: #28a745;
}

.transaction-item.debit .transaction-amount {
  color: #dc3545;
}

.no-transactions {
  text-align: center;
  padding: 20px;
  color: #666;
}

@media (max-width: 600px) {
  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .transaction-amount {
    margin-top: 10px;
  }
  .avatar-img {
    width: 100px;
    height: 100px;
  }
}
</style>

