<script>
import { useUserStore } from '@/stores/userStore'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
    setup() {
        const userStore = useUserStore()
        const router = useRouter()
        const form = ref({
            id: '',
            name: '',
            email: '',
            username: '',
            description: '',
            balance: 0,
            avatar: '',
            firstName: '',
            lastName: ''
        })
        const errors = ref({})
        const isLoading = ref(false)

        // Initialize form with data from store
        onMounted(() => {
            if (!userStore.isAuthenticated) {
                router.push('/login')
                return
            }
            
            form.value = { 
                ...userStore.user,
                // Split name into firstName and lastName if needed
                firstName: userStore.user.firstName || userStore.user.name?.split(' ')[0] || '',
                lastName: userStore.user.lastName || userStore.user.name?.split(' ').slice(1).join(' ') || ''
            }
        })

        const validateForm = () => {
            errors.value = {}
            let isValid = true

            if (!form.value.name) {
                errors.value.name = 'Name is required'
                isValid = false
            }

            if (!form.value.email) {
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
            if (file) {
                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    alert('File size should be less than 2MB')
                    return
                }
                
                const reader = new FileReader()
                reader.onload = (e) => {
                    form.value.avatar = e.target.result
                }
                reader.readAsDataURL(file)
            }
        }

        const saveChanges = async () => {
            if (!validateForm()) return
            
            isLoading.value = true
            
            try {
                // Update name structure if using firstName/lastName
                if (form.value.firstName || form.value.lastName) {
                    form.value.name = `${form.value.firstName} ${form.value.lastName}`.trim()
                }
                
                const success = await userStore.updateUser(form.value)
                if (success) {
                    alert('Profile updated successfully!')
                    router.push('/akun')
                } else {
                    throw new Error('Update failed')
                }
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
            saveChanges
        }
    }
}
</script>

<template>
    <main id="settings">
        <h1>Settings</h1>
        
        <div class="settings-container">
            <div class="avatar-section">
                <img :src="form.avatar || 'https://i.pravatar.cc/150'" alt="User Avatar" class="avatar-img">
                <input type="file" @change="handleAvatarChange" accept="image/*">
            </div>
            
            <form @submit.prevent="saveChanges" class="settings-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input id="firstName" v-model="form.firstName" type="text">
                        <span class="error-message">{{ errors.firstName }}</span>
                    </div>
                    
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input id="lastName" v-model="form.lastName" type="text">
                        <span class="error-message">{{ errors.lastName }}</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input id="name" v-model="form.name" type="text" disabled>
                    <span class="error-message">{{ errors.name }}</span>
                </div>
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" v-model="form.email" type="email">
                    <span class="error-message">{{ errors.email }}</span>
                </div>
                
                <div class="form-group">
                    <label for="username">Username</label>
                    <input id="username" v-model="form.username" type="text" disabled>
                </div>
                
                <div class="form-group">
                    <label for="balance">Balance</label>
                    <input id="balance" v-model.number="form.balance" type="number">
                    <span class="error-message">{{ errors.balance }}</span>
                </div>
                
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" v-model="form.description"></textarea>
                </div>
                
                <button type="submit" class="save-btn" :disabled="isLoading">
                    {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
            </form>
        </div>
    </main>
</template>

<style scoped>
/* Add these to your existing styles */
.form-row {
    display: flex;
    gap: 15px;
}

.form-row .form-group {
    flex: 1;
}

.error-message {
    color: #e74c3c;
    font-size: 12px;
    margin-top: 4px;
    height: 16px;
}

input[disabled] {
    background-color: #f0f0f0;
    cursor: not-allowed;
}

.save-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}
</style>