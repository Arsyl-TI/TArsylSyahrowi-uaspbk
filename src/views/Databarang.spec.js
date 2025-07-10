// Databarang.spec.js
import { mount } from '@vue/test-utils'
import Databarang from '@/views/Databarang.vue'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('Databarang.vue', () => {
  let wrapper
  const mockBarang = [
    {
      id: 1,
      kode: 'BRG001',
      nama: 'Laptop',
      harga: 10000000,
      stok: 5,
      kategori: 'Elektronik'
    },
    {
      id: 2,
      kode: 'BRG002',
      nama: 'Mouse',
      harga: 150000,
      stok: 20,
      kategori: 'Aksesoris'
    }
  ]

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockBarang })
    axios.post.mockResolvedValue({ data: { ...mockBarang[0], id: 3 } })
    axios.put.mockResolvedValue({ data: mockBarang[0] })
    axios.delete.mockResolvedValue({})

    wrapper = mount(Databarang)
  })

  it('renders correctly', () => {
    expect(wrapper.find('h2').text()).toBe('Manajemen Data Barang')
    expect(wrapper.find('.form-container h3').text()).toBe('Tambah Barang')
    expect(wrapper.findAll('table thead th').length).toBe(6)
  })

  it('fetches barang data on mount', async () => {
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3004/barang')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.daftarBarang).toEqual(mockBarang)
  })

  it('displays barang data in table', async () => {
    await wrapper.vm.$nextTick()
    const rows = wrapper.findAll('table tbody tr')
    expect(rows.length).toBe(2)
    
    const firstRowCells = rows[0].findAll('td')
    expect(firstRowCells[0].text()).toBe('BRG001')
    expect(firstRowCells[1].text()).toBe('Laptop')
    expect(firstRowCells[2].text()).toBe('Rp 10.000.000')
    expect(firstRowCells[3].text()).toBe('5')
    expect(firstRowCells[4].text()).toBe('Elektronik')
  })

  it('validates form inputs', async () => {
    wrapper.vm.validateForm()
    expect(wrapper.vm.errors.kode).toBe('Kode barang harus diisi')
    expect(wrapper.vm.errors.nama).toBe('Nama barang harus diisi')
    expect(wrapper.vm.errors.kategori).toBe('Kategori harus diisi')

    wrapper.setData({
      form: {
        kode: 'TEST',
        nama: 'Test Barang',
        harga: -100,
        stok: -5,
        kategori: 'Test'
      }
    })

    wrapper.vm.validateForm()
    expect(wrapper.vm.errors.harga).toBe('Harga tidak boleh negatif')
    expect(wrapper.vm.errors.stok).toBe('Stok tidak boleh negatif')
  })

  it('adds new barang', async () => {
    wrapper.setData({
      form: {
        kode: 'BRG003',
        nama: 'Keyboard',
        harga: 250000,
        stok: 10,
        kategori: 'Aksesoris'
      }
    })

    await wrapper.find('form').trigger('submit.prevent')
    
    expect(axios.post).toHaveBeenCalled()
    expect(axios.get).toHaveBeenCalledTimes(6)
    expect(wrapper.vm.form.kode).toBe('') // form should be reset
  })

  it('edits existing barang', async () => {
    await wrapper.vm.$nextTick()
    await wrapper.findAll('.btn-edit')[0].trigger('click')
    
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.form.id).toBe(1)
    expect(wrapper.vm.form.kode).toBe('BRG001')
    expect(wrapper.find('.form-container h3').text()).toBe('Edit Barang')

    // Simulate editing
    wrapper.setData({
      form: {
        ...wrapper.vm.form,
        harga: 11000000
      }
    })

    await wrapper.find('form').trigger('submit.prevent')
    
    expect(axios.put).toHaveBeenCalledWith(
      `http://localhost:3004/barang/1`,
      expect.objectContaining({ harga: 11000000 })
    )
  })

  it('cancels edit mode', async () => {
    // Pertama kita perlu masuk ke mode edit
    wrapper.setData({
      isEdit: true,
      form: {
        id: 1,
        kode: 'BRG001',
        nama: 'Laptop',
        harga: 10000000,
        stok: 5,
        kategori: 'Elektronik'
      }
    });
    
    await wrapper.vm.$nextTick(); // Tunggu re-render
    
    // Sekarang tombol Batal seharusnya ada
    const cancelButton = wrapper.find('.btn-secondary');
    expect(cancelButton.exists()).toBe(true); // Verifikasi tombol ada
    
    await cancelButton.trigger('click');
    
    expect(wrapper.vm.isEdit).toBe(false);
    expect(wrapper.vm.form.id).toBe(null);
  });

  it('deletes barang', async () => {
    window.confirm = vi.fn(() => true)
    await wrapper.vm.$nextTick()
    await wrapper.findAll('.btn-danger')[0].trigger('click')
    
    expect(window.confirm).toHaveBeenCalled()
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:3004/barang/1')
  })

  it('formats harga correctly', () => {
    expect(wrapper.vm.formatHarga(1000000)).toBe('1.000.000')
    expect(wrapper.vm.formatHarga(5000)).toBe('5.000')
  })

  it('shows loading state', async () => {
    wrapper.setData({ loading: true })
    await wrapper.vm.$nextTick()
    
    const submitButton = wrapper.find('.btn-primary')
    expect(submitButton.find('.spinner').exists()).toBe(true)
    expect(submitButton.attributes('disabled')).toBeDefined()
  })
})