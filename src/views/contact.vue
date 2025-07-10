<template>
  <main class="contact">
    <div class="contact-header">
      <h1>Get in Touch</h1>
      <p class="subtitle">Have questions or feedback? We're here to help.</p>
      <div class="divider"></div>
    </div>

    <div class="contact-content">
      <form @submit.prevent="submitForm" class="contact-form">
        <div class="form-group">
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            required
            class="form-input"
          >
          <label for="name" class="form-label">Nama</label>
          <div class="underline"></div>
        </div>

        <div class="form-group">
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            required
            class="form-input"
          >
          <label for="email" class="form-label">Email Address</label>
          <div class="underline"></div>
        </div>

        <div class="form-group">
          <input 
            type="text" 
            id="subject" 
            v-model="formData.subject" 
            required
            class="form-input"
          >
          <label for="subject" class="form-label">Subject</label>
          <div class="underline"></div>
        </div>

        <div class="form-group">
          <textarea 
            id="message" 
            v-model="formData.message" 
            required 
            rows="5"
            class="form-textarea"
          ></textarea>
          <label for="message" class="form-label">Pesan Anda</label>
          <div class="underline"></div>
        </div>

        <button type="submit" class="submit-btn">
          <span>Send Message</span>
          <svg width="24" height="24" viewBox="0 0 24 24" class="send-icon">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
          </svg>
        </button>
      </form>

      <div class="contact-info">
        <div class="info-section">
          <h3 class="info-title">Contact Information</h3>
          <p class="info-description">Feel free to reach out through any of these channels</p>
          
          <div class="info-card">
            <div class="icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" class="info-icon">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h4>Email</h4>
              <p>support@example.com</p>
            </div>
          </div>

          <div class="info-card">
            <div class="icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" class="info-icon">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h4>Phone</h4>
              <p>+1 (123) 456-7890</p>
            </div>
          </div>

          <div class="info-card">
            <div class="icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" class="info-icon">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h4>Office</h4>
              <p>123 Business Street, City, Country</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="submitStatus" class="notification" :class="submitStatus">
        <p>{{ submitMessage }}</p>
        <div class="progress-bar"></div>
      </div>
    </transition>
  </main>
</template>

<script setup>
// src/views/contact.vue
import { ref } from 'vue';

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitStatus = ref(null);
const submitMessage = ref('');

const submitForm = () => {
  submitStatus.value = 'loading';
  submitMessage.value = 'Sending your message...';

  setTimeout(() => {
    submitStatus.value = 'success';
    submitMessage.value = 'Thank you! Your message has been sent.';
    
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };

    setTimeout(() => {
      submitStatus.value = null;
    }, 5000);
  }, 1500);
};
</script>

<style scoped>
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: #333;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.contact-header {
  text-align: center;
  margin-bottom: 4rem;
}

.contact-header h1 {
  font-size: 2.75rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.125rem;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
}

.divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  margin: 0 auto;
  border-radius: 2px;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: flex-start;
}

.contact-form {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.form-group {
  position: relative;
  margin-bottom: 2rem;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1rem;
  color: #2c3e50;
  background: transparent;
  transition: all 0.3s ease;
}

.form-textarea {
  resize: none;
  min-height: 120px;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-bottom-color: #3498db;
}

.form-label {
  position: absolute;
  top: 0.75rem;
  left: 0;
  color: #95a5a6;
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.3s ease;
}

.form-input:focus ~ .form-label,
.form-input:not(:placeholder-shown) ~ .form-label,
.form-textarea:focus ~ .form-label,
.form-textarea:not(:placeholder-shown) ~ .form-label {
  top: -1.25rem;
  left: 0;
  font-size: 0.875rem;
  color: #3498db;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #3498db;
  transition: width 0.3s ease;
}

.form-input:focus ~ .underline,
.form-textarea:focus ~ .underline {
  width: 100%;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  margin-top: 1rem;
  width: 100%;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.send-icon {
  transition: transform 0.3s ease;
}

.submit-btn:hover .send-icon {
  transform: translateX(4px);
}

.contact-info {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.info-description {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-card:hover {
  background: #f8f9fa;
  transform: translateX(5px);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
}

.info-icon {
  color: #3498db;
  width: 24px;
  height: 24px;
}

.info-card h4 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.info-card p {
  color: #7f8c8d;
  margin: 0;
  line-height: 1.6;
}

.notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1.25rem 1.75rem;
  border-radius: 12px;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 350px;
  overflow: hidden;
}

.notification.success {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.notification.loading {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  width: 100%;
  animation: progress 5s linear forwards;
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
  
  .contact-header h1 {
    font-size: 2.25rem;
  }
  
  .contact-form, .contact-info {
    padding: 1.75rem;
  }
}
</style>