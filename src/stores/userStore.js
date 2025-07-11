// src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const register = async (userData) => {
    try {
      const response = await axios.post('https://fake-json-chi.vercel.app/users', userData)
      user.value = response.data
      isAuthenticated.value = true
      return response.data
    } catch (error) {
      throw error
    }
  }

  const login = async (credentials) => {
    try {
      const { data } = await axios.get('https://fake-json-chi.vercel.app/users')
      const foundUser = data.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password
      )
      
      if (foundUser) {
        user.value = foundUser
        isAuthenticated.value = true
        return foundUser
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
  }

  const updateUser = async (userData) => {
    try {
      const response = await axios.patch(`https://fake-json-chi.vercel.app/users/${user.value.id}`, userData)
      user.value = { ...user.value, ...response.data } // Update local state
      return true
    } catch (error) {
      console.error('Error updating user:', error)
      throw error // Throw error to handle in component
    }
  }

  const addUserTransaction = async (transactionData) => {
    try {
      if (!user.value) throw new Error('User not logged in')
      
      // Add transaction to transactions collection
      const transactionStore = useTransactionStore()
      const newTransaction = await transactionStore.addTransaction({
        ...transactionData,
        userId: user.value.id
      })
      
      // Update user's balance
      const newBalance = user.value.balance - transactionData.total
      await updateUser({ balance: newBalance })
      
      // Add transaction reference to user
      const updatedUser = await axios.patch(`https://fake-json-chi.vercel.app/users/${user.value.id}`, {
        transactions: [...user.value.transactions, newTransaction.id]
      })
      
      user.value = updatedUser.data
      return newTransaction
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  }

  return { user, isAuthenticated, register, login, logout, updateUser, addUserTransaction }
})
