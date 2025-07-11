<script>
import { useUserStore } from '@/stores/userStore'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const isLoading = ref(false)
    const errors = ref({})
    
    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      description: '',
      balance: 0,
      avatar: ''
    })

    onMounted(() => {
      if (!userStore.isAuthenticated) {
        router.push('/login')
        return
      }
      
      const nameParts = userStore.user.name?.split(' ') || []
      const firstName = userStore.user.firstName || nameParts[0] || ''
      const lastName = userStore.user.lastName || nameParts.slice(1).join(' ') || ''
      
      form.value = {
        firstName,
        lastName,
        email: userStore.user.email || '',
        username: userStore.user.username || '',
        description: userStore.user.description || '',
        balance: userStore.user.balance || 0,
        avatar: userStore.user.avatar || 'https://i.pravatar.cc/150'
      }
    })

    const validateForm = () => {
      errors.value = {}
      let isValid = true

      if (!form.value.firstName.trim()) {
        errors.value.firstName = 'First name is required'
        isValid = false
      }

      if (!form.value.email.trim()) {
        errors.value.email = 'Email is required'
        isValid = false
      } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
        errors.value.email = 'Please enter a valid email'
        isValid = false
      }

      if (form.value.balance < 0) {
        errors.value.balance = 'Balance cannot be negative'
        isValid = false
      }

      return isValid
    }

    const handleAvatarChange = (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        form.value.avatar = e.target.result
      }
      reader.readAsDataURL(file)
    }

    const saveChanges = async () => {
      if (!validateForm()) return
      
      isLoading.value = true
      
      try {
        const userData = {
          ...form.value,
          name: `${form.value.firstName} ${form.value.lastName}`.trim(),
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          avatar: form.value.avatar
        }
        
        // Update di JSON server
        const response = await axios.patch(`https://fake-json-chi.vercel.app/users/${userStore.user.id}`, userData)
        
        // Update di userStore
        await userStore.updateUser(response.data)
        
        alert('Profile updated successfully!')
        router.push('/akun')
      } catch (error) {
        alert('Failed to update profile: ' + error.message)
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      errors,
      isLoading,
      handleAvatarChange,
      saveChanges,
      fullName: computed(() => `${form.value.firstName} ${form.value.lastName}`.trim())
    }
  }
}
</script>

<template>
  <main id="settings">
    <h1>Pengaturan Akun</h1>
    
    <div class="settings-container">
      <div class="avatar-section">
        <img :src="form.avatar" alt="User Avatar" class="avatar-img">
        <label for="avatar-upload" class="avatar-upload-btn">
          <input 
            id="avatar-upload" 
            type="file" 
            @change="handleAvatarChange" 
            accept="image/*"
            hidden
          >
          Ubah Foto
        </label>
      </div>
      
      <form @submit.prevent="saveChanges" class="settings-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">Nama Depan</label>
            <input 
              id="firstName" 
              v-model="form.firstName" 
              type="text"
              placeholder="Masukkan nama depan"
            >
            <span class="error-message">{{ errors.firstName }}</span>
          </div>
          
          <div class="form-group">
            <label for="lastName">Nama Belakang</label>
            <input 
              id="lastName" 
              v-model="form.lastName" 
              type="text"
              placeholder="Masukkan nama belakang"
            >
            <span class="error-message">{{ errors.lastName }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="fullName">Nama Lengkap</label>
          <input 
            id="fullName" 
            :value="fullName" 
            type="text" 
            disabled
            class="disabled-input"
          >
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            v-model="form.email" 
            type="email"
            placeholder="Masukkan email"
          >
          <span class="error-message">{{ errors.email }}</span>
        </div>
        
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            id="username" 
            v-model="form.username" 
            type="text" 
            disabled
            class="disabled-input"
          >
        </div>
        
        <div class="form-group">
          <label for="balance">Saldo</label>
          <input 
            id="balance" 
            v-model.number="form.balance" 
            type="number"
            placeholder="Masukkan saldo"
          >
          <span class="error-message">{{ errors.balance }}</span>
        </div>
        
        <div class="form-group">
          <label for="description">Deskripsi</label>
          <textarea 
            id="description" 
            v-model="form.description"
            placeholder="Tulis deskripsi tentang Anda"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="save-btn" 
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Simpan Perubahan</span>
            <span v-else class="spinner"></span>
          </button>
          
          <router-link to="/akun" class="cancel-btn">
            Batal
          </router-link>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
#settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.settings-container {
  display: flex;
  gap: 30px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 200px;
}

.avatar-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0e0e0;
}

.avatar-upload-btn {
  padding: 8px 15px;
  background: #3498db;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  text-align: center;
  width: 100%;
}

.avatar-upload-btn:hover {
  background: #2980b9;
}

.settings-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: 500;
  color: #2c3e50;
}

input, textarea {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.disabled-input {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  min-height: 18px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.save-btn {
  padding: 12px 25px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.save-btn:hover {
  background: #27ae60;
}

.save-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 12px 25px;
  background: #e0e0e0;
  color: #2c3e50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  transition: background 0.3s;
}

.cancel-btn:hover {
  background: #d0d0d0;
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

@media (max-width: 768px) {
  .settings-container {
    flex-direction: column;
  }
  
  .avatar-section {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
}
</style>