// src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fake-json-chi.vercel.app/users'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, userData)
      user.value = response.data
      isAuthenticated.value = true
      return response.data
    } catch (error) {
      throw error
    }
  }

  const login = async (credentials) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/users`)
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
      const response = await axios.patch(`${API_BASE_URL}/users/${user.value.id}`, userData)
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
      const updatedUser = await axios.patch(`${API_BASE_URL}/users/${user.value.id}`, {
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
