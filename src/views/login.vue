<template>
    <main id="login-page">
        <div class="login-container">
            <div class="login-card">
            <div class="login-header">
                <h2>Selamat Datang</h2>
                <p>Please enter your credentials to login</p>
            </div>
            
            <form @submit.prevent="handleLogin" class="login-form">
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
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    v-model="form.password" 
                    placeholder="Masukkan password"
                    required
                >
                <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
                </div>
                
                <div class="form-options">
                <label class="remember-me">
                    <input type="checkbox" v-model="form.remember"> Remember me
                </label>
                <router-link to="/forgot-password" class="forgot-password">Lupa password?</router-link>
                </div>
                
                <button type="submit" class="login-button" :disabled="loading">
                <span v-if="!loading">Login</span>
                <span v-else class="spinner"></span>
                </button>
                
                <div class="login-footer">
                <p>Belum punya akun? <router-link to="/register">register</router-link></p>
                </div>
            </form>
            </div>
        </div>
    </main>
</template>

<script>
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'LoginPage',
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        remember: false
      },
      errors: {
        email: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = { email: '', password: '' };
      
      if (!this.form.email) {
        this.errors.email = 'Email is required';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email';
        isValid = false;
      }
      
      if (!this.form.password) {
        this.errors.password = 'Password is required';
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters';
        isValid = false;
      }
      
      return isValid;
    },
    async handleLogin() {
      if (this.validateForm()) {
        this.loading = true;
        
        try {
          await this.userStore.login({
            email: this.form.email,
            password: this.form.password
          })
          
          this.$router.push('/akun')
        } catch (error) {
          this.errors.password = 'Invalid email or password'
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-header p {
  color: #7f8c8d;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7f8c8d;
  cursor: pointer;
}

.remember-me input {
  margin: 0;
}

.forgot-password {
  color: #3498db;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  background-color: #3498db;
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

.login-button:hover {
  background-color: #2980b9;
}

.login-button:disabled {
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

.login-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #7f8c8d;
}

.login-footer a {
  color: #3498db;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
}
</style>