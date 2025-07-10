<script>
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'

export default {
  name: 'RegisterPage',
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      },
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      },
      loading: false
    }
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = {
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      };
      
      // First Name validation
      if (!this.form.firstName.trim()) {
        this.errors.firstName = 'First name is required';
        isValid = false;
      } else if (this.form.firstName.length < 2) {
        this.errors.firstName = 'First name must be at least 2 characters';
        isValid = false;
      }
      
      // Last Name validation
      if (!this.form.lastName.trim()) {
        this.errors.lastName = 'Last name is required';
        isValid = false;
      } else if (this.form.lastName.length < 2) {
        this.errors.lastName = 'Last name must be at least 2 characters';
        isValid = false;
      }
      
      // Email validation
      if (!this.form.email) {
        this.errors.email = 'Email is required';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email';
        isValid = false;
      }
      
      // Username validation
      if (!this.form.username) {
        this.errors.username = 'Username is required';
        isValid = false;
      } else if (this.form.username.length < 4) {
        this.errors.username = 'Username must be at least 4 characters';
        isValid = false;
      } else if (!/^[a-zA-Z0-9_]+$/.test(this.form.username)) {
        this.errors.username = 'Username can only contain letters, numbers and underscores';
        isValid = false;
      }
      
      // Password validation
      if (!this.form.password) {
        this.errors.password = 'Password is required';
        isValid = false;
      } else if (this.form.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters';
        isValid = false;
      } else if (!/[A-Z]/.test(this.form.password)) {
        this.errors.password = 'Password must contain at least one uppercase letter';
        isValid = false;
      } else if (!/[0-9]/.test(this.form.password)) {
        this.errors.password = 'Password must contain at least one number';
        isValid = false;
      }
      
      // Confirm Password validation
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
      
      return isValid;
    },
    async handleRegister() {
      if (this.validateForm()) {
        this.loading = true;
        
        try {
          const userData = {
            name: `${this.form.firstName} ${this.form.lastName}`,
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            email: this.form.email,
            username: this.form.username,
            password: this.form.password,
            balance: 0,
            description: 'New user',
            avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
            transactions: []
          }
          
          await this.userStore.register(userData)
          
          this.$router.push('/login')
          alert('Registration successful! Please login with your credentials.')
        } catch (error) {
          alert('Registration failed: ' + error.message)
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>
<template>
    <main id="register-page">
        <div class="register-container">
            <div class="register-card">
            <div class="register-header">
                <h2>Buat Akun</h2>
                <p>Join us today and start your journey</p>
            </div>
            
            <form @submit.prevent="handleRegister" class="register-form">
                <div class="form-row">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input 
                    type="text" 
                    id="firstName" 
                    v-model="form.firstName" 
                    placeholder="Masukkan nama Pertama"
                    required
                    >
                    <span class="error-message" v-if="errors.firstName">{{ errors.firstName }}</span>
                </div>
                
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input 
                    type="text" 
                    id="lastName" 
                    v-model="form.lastName" 
                    placeholder="Masukkan nama Terakhir"
                    required
                    >
                    <span class="error-message" v-if="errors.lastName">{{ errors.lastName }}</span>
                </div>
                </div>
                
                <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                    type="email" 
                    id="email" 
                    v-model="form.email" 
                    placeholder="Masukkan email"
                    required
                >
                <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
                </div>
                
                <div class="form-group">
                <label for="username">Username</label>
                <input 
                    type="text" 
                    id="username" 
                    v-model="form.username" 
                    placeholder="Pilih username"
                    required
                >
                <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
                </div>
                
                <div class="form-row">
                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                    type="password" 
                    id="password" 
                    v-model="form.password" 
                    placeholder="Buat password"
                    required
                    >
                    <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">Konfirmasi Password</label>
                    <input 
                    type="password" 
                    id="confirmPassword" 
                    v-model="form.confirmPassword" 
                    placeholder="Konfirmasi password"
                    required
                    >
                    <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
                </div>
                </div>
                
                <div class="form-options">
                <label class="terms-agreement">
                    <input type="checkbox" v-model="form.agreeTerms" required>
                    Saya Menyetujui <a href="#" class="terms-link">Ketentuan</a> dan <a href="#" class="terms-link">Peraturan yang berlaku</a>
                </label>
                </div>
                
                <button type="submit" class="register-button" :disabled="loading">
                <span v-if="!loading">Create Account</span>
                <span v-else class="spinner"></span>
                </button>
                
                <div class="register-footer">
                <p>Sudah punya Akun? <router-link to="/login" class="login-link">Login</router-link></p>
                </div>
            </form>
            </div>
        </div>
    </main>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 520px;
  padding: 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.register-header p {
  color: #7f8c8d;
  font-size: 14px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
  min-height: 16px;
}

.form-options {
  margin: 10px 0;
}

.terms-agreement {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #7f8c8d;
  line-height: 1.4;
  cursor: pointer;
}

.terms-agreement input {
  margin-top: 3px;
}

.terms-link {
  color: #3498db;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.register-button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.register-button:hover {
  background-color: #27ae60;
}

.register-button:disabled {
  background-color: #bdc3c7;
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

.register-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #7f8c8d;
}

.login-link {
  color: #3498db;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .register-card {
    padding: 30px 20px;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 10px;
  }
  
  .terms-agreement {
    font-size: 12px;
  }
}
</style>