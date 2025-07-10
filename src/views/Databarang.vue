<template>
  <main id="data-barang-page">
    <div class="data-barang-container">
      <h2>Manajemen Data Barang</h2>
      
      <!-- Form Tambah/Edit Barang -->
      <div class="form-container">
        <h3>{{ formTitle }}</h3>
        <form @submit.prevent="simpanBarang">
          <div class="form-row">
            <div class="form-group">
              <label>Kode Barang</label>
              <input v-model="form.kode" type="text" required>
              <span class="error-message" v-if="errors.kode">{{ errors.kode }}</span>
            </div>
            
            <div class="form-group">
              <label>Nama Barang</label>
              <input v-model="form.nama" type="text" required>
              <span class="error-message" v-if="errors.nama">{{ errors.nama }}</span>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Harga</label>
              <input v-model.number="form.harga" type="number" min="0" required>
              <span class="error-message" v-if="errors.harga">{{ errors.harga }}</span>
            </div>
            
            <div class="form-group">
              <label>Stok</label>
              <input v-model.number="form.stok" type="number" min="0" required>
              <span class="error-message" v-if="errors.stok">{{ errors.stok }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label>Kategori</label>
            <input v-model="form.kategori" type="text" required>
            <span class="error-message" v-if="errors.kategori">{{ errors.kategori }}</span>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="loading">
              <span v-if="!loading">Simpan</span>
              <span v-else class="spinner"></span>
            </button>
            <button v-if="isEdit" @click="batalEdit" type="button" class="btn-secondary">Batal</button>
          </div>
        </form>
      </div>
      
      <!-- Tabel Data Barang -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Barang</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="barang in daftarBarang" :key="barang.id">
              <td>{{ barang.kode }}</td>
              <td>{{ barang.nama }}</td>
              <td>Rp {{ formatHarga(barang.harga) }}</td>
              <td>{{ barang.stok }}</td>
              <td>{{ barang.kategori }}</td>
              <td class="actions">
                <button @click="editBarang(barang)" class="btn-edit">Edit</button>
                <button @click="hapusBarang(barang.id)" class="btn-danger">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DataBarang',
  data() {
    return {
      daftarBarang: [],
      form: {
        id: null,
        kode: '',
        nama: '',
        harga: 0,
        stok: 0,
        kategori: ''
      },
      errors: {},
      loading: false,
      isEdit: false,
      apiUrl: 'http://localhost:3004/barang'
    }
  },
  computed: {
    formTitle() {
      return this.isEdit ? 'Edit Barang' : 'Tambah Barang';
    }
  },
  created() {
    this.getBarang();
  },
  methods: {
    async getBarang() {
        this.loading = true;
        try {
            const response = await axios.get(this.apiUrl);
            // Filter data yang memiliki ID valid
            this.daftarBarang = response.data.filter(item => item.id !== null && item.id !== undefined)
            .map(item => ({
                ...item,
                id: Number(item.id) || item.id // Konversi ke number jika memungkinkan
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
            alert(`Gagal memuat data barang: ${error.message}`);
            if (error.response) {
            console.error('Response data:', error.response.data);
            }
        } finally {
            this.loading = false;
        }
    },
    
    validateForm() {
      this.errors = {};
      let isValid = true;
      
      if (!this.form.kode.trim()) {
        this.errors.kode = 'Kode barang harus diisi';
        isValid = false;
      }
      
      if (!this.form.nama.trim()) {
        this.errors.nama = 'Nama barang harus diisi';
        isValid = false;
      }
      
      if (this.form.harga < 0) {
        this.errors.harga = 'Harga tidak boleh negatif';
        isValid = false;
      }
      
      if (this.form.stok < 0) {
        this.errors.stok = 'Stok tidak boleh negatif';
        isValid = false;
      }
      
      if (!this.form.kategori.trim()) {
        this.errors.kategori = 'Kategori harus diisi';
        isValid = false;
      }
      
      // Validasi tambahan untuk mode edit
      if (this.isEdit && !this.form.id) {
        this.errors.general = 'ID barang tidak valid';
        isValid = false;
      }
      
      return isValid;
    },
    
    async simpanBarang() {
      if (!this.validateForm()) return;
      
      this.loading = true;
      try {
        if (this.isEdit) {
          await axios.put(`${this.apiUrl}/${this.form.id}`, this.form);
        } else {
          // Generate ID baru secara berurutan
          const ids = this.daftarBarang.map(item => parseInt(item.id));
          const maxId = Math.max(...ids, 0);
          const newId = maxId + 1;
          
          const newItem = {
            ...this.form,
            id: newId.toString() // Simpan sebagai string jika diperlukan
          };
          
          await axios.post(this.apiUrl, newItem);
        }
        
        this.resetForm();
        await this.getBarang();
      } catch (error) {
        console.error('Error saving data:', error);
        alert(`Gagal menyimpan data: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },
    
    editBarang(barang) {
      // Pastikan barang memiliki ID yang valid
      if (!barang.id) {
        alert('Barang yang akan diedit tidak memiliki ID yang valid');
        return;
      }
      
      // Salin data barang ke form
      this.form = {
        id: Number(barang.id),
        kode: barang.kode || '',
        nama: barang.nama || '',
        harga: Number(barang.harga) || 0,
        stok: Number(barang.stok) || 0,
        kategori: barang.kategori || ''
      };
      
      this.isEdit = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    batalEdit() {
      this.resetForm();
    },
    
    async hapusBarang(id) {
      if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
        this.loading = true;
        try {
          const idToDelete = Number(id);
          if (isNaN(idToDelete)) {
            throw new Error('ID barang harus berupa angka');
          }
          
          await axios.delete(`${this.apiUrl}/${idToDelete}`);
          await this.getBarang();
        } catch (error) {
          console.error('Error deleting data:', error);
          alert('Gagal menghapus data barang: ' + (error.response?.data?.message || error.message));
        } finally {
          this.loading = false;
        }
      }
    },
    
    resetForm() {
      this.form = {
        id: null,
        kode: '',
        nama: '',
        harga: 0,
        stok: 0,
        kategori: ''
      };
      this.isEdit = false;
      this.errors = {};
    },
    
    formatHarga(value) {
      return new Intl.NumberFormat('id-ID').format(value);
    }
  }
}
</script>

<style scoped>
#data-barang-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.data-barang-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

h2 {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.form-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.form-container h3 {
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
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
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-primary:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn-edit {
  background-color: #f39c12;
  color: white;
}

.btn-edit:hover {
  background-color: #e67e22;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #3498db;
  color: white;
  font-weight: 500;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

tr:hover {
  background-color: #f1f1f1;
}

.actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .data-barang-container {
    padding: 15px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  button {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>