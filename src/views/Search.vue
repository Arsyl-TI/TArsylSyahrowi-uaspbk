<template>
    <main id="search-page">
        <div class="search-container">
            <div class="search-header">
            <div class="search-bar-container">
                <div class="search-bar">
                <input
                    type="text"
                    v-model="searchQuery"
                    @keyup.enter="performSearch"
                    placeholder="Search for products, categories..."
                    class="search-input"
                />
                <button @click="performSearch" class="search-button">
                    <i class="search-icon">🔍</i>
                </button>
                </div>
            </div>
            
            <div class="search-filters">
                <div class="filter-section">
                <h4>Categories</h4>
                <div class="filter-options">
                    <label v-for="category in categories" :key="category.id" class="filter-option">
                    <input
                        type="checkbox"
                        :value="category.id"
                        v-model="selectedCategories"
                        @change="applyFilters"
                    />
                    <span class="checkmark"></span>
                    {{ category.name }} ({{ category.count }})
                    </label>
                </div>
                </div>
                
                <div class="filter-section">
                <h4>Price Range</h4>
                <div class="price-range">
                    <input
                    type="range"
                    v-model="priceRange"
                    min="0"
                    max="10000000"
                    step="50000"
                    @change="applyFilters"
                    class="range-slider"
                    />
                    <div class="price-values">
                    <span>Rp 0</span>
                    <span>Rp {{ formatPrice(priceRange) }}</span>
                    <span>Rp 10,000,000</span>
                    </div>
                </div>
                </div>
                
                <div class="filter-section">
                <h4>Sort By</h4>
                <select v-model="sortOption" @change="applySorting" class="sort-select">
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="rating">Highest Rated</option>
                </select>
                </div>
            </div>
            </div>
            
            <div class="search-results">
            <div v-if="isLoading" class="loading-indicator">
                <div class="spinner"></div>
                <p>Searching...</p>
            </div>
            
            <div v-else-if="searchResults.length > 0" class="results-grid">
                <div
                v-for="product in searchResults"
                :key="product.id"
                class="product-card"
                @click="viewProduct(product.id)"
                >
                <div class="product-image">
                    <img :src="product.image" :alt="product.name" />
                    <div v-if="product.isNew" class="new-badge">New</div>
                    <div v-if="product.discount" class="discount-badge">
                    -{{ product.discount }}%
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p class="product-description">{{ product.shortDescription }}</p>
                    <div class="product-rating">
                    <span class="stars">★★★★★</span>
                    <span class="rating-value">{{ product.rating }}</span>
                    <span class="review-count">({{ product.reviewCount }})</span>
                    </div>
                    <div class="product-price">
                    <span class="current-price">Rp {{ formatPrice(product.price) }}</span>
                    <span v-if="product.originalPrice" class="original-price">
                        Rp {{ formatPrice(product.originalPrice) }}
                    </span>
                    </div>
                    <button class="add-to-cart-btn" @click.stop="addToCart(product)">
                    Add to Cart
                    </button>
                </div>
                </div>
            </div>
            
            <div v-else class="no-results">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="No results" />
                <h3>No results found</h3>
                <p>Try adjusting your search or filters</p>
                <button @click="resetFilters" class="reset-filters-btn">Reset Filters</button>
            </div>
            
            <div v-if="searchResults.length > 0" class="pagination">
                <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="page-button"
                >
                Previous
                </button>
                <span class="page-info">
                Page {{ currentPage }} of {{ totalPages }}
                </span>
                <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="page-button"
                >
                Next
                </button>
            </div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
  name: 'SearchPage',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      isLoading: false,
      categories: [
        { id: 1, name: 'Electronics', count: 45 },
        { id: 2, name: 'Fashion', count: 32 },
        { id: 3, name: 'Home & Living', count: 28 },
        { id: 4, name: 'Beauty', count: 19 },
        { id: 5, name: 'Sports', count: 15 }
      ],
      selectedCategories: [],
      priceRange: 5000000,
      sortOption: 'relevance',
      currentPage: 1,
      itemsPerPage: 12,
      totalItems: 0,
      sampleProducts: [
        {
          id: 1,
          name: 'Wireless Bluetooth Headphones',
          shortDescription: 'Noise cancelling with 30hr battery life',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          price: 1200000,
          originalPrice: 1500000,
          rating: 4.5,
          reviewCount: 128,
          isNew: true,
          discount: 20,
          category: 1
        },
        {
          id: 2,
          name: 'Smart Watch Pro',
          shortDescription: 'Fitness tracker with heart rate monitor',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          price: 2500000,
          rating: 4.2,
          reviewCount: 86,
          isNew: false,
          category: 1
        },
        {
          id: 3,
          name: 'Organic Cotton T-Shirt',
          shortDescription: '100% organic cotton, comfortable fit',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          price: 250000,
          originalPrice: 350000,
          rating: 4.7,
          reviewCount: 215,
          isNew: false,
          discount: 29,
          category: 2
        },
        {
          id: 4,
          name: 'Ceramic Dinner Set',
          shortDescription: 'Elegant 16-piece ceramic dinnerware set',
          image: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          price: 850000,
          rating: 4.8,
          reviewCount: 42,
          isNew: true,
          category: 3
        },
        {
          id: 5,
          name: 'Yoga Mat',
          shortDescription: 'Non-slip, eco-friendly material',
          image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          price: 350000,
          originalPrice: 450000,
          rating: 4.3,
          reviewCount: 97,
          isNew: false,
          discount: 22,
          category: 5
        }
      ]
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },
    filteredResults() {
      let results = this.sampleProducts
      
      // Apply category filter
      if (this.selectedCategories.length > 0) {
        results = results.filter(product => 
          this.selectedCategories.includes(product.category)
        )
      }
      
      // Apply price filter
      results = results.filter(product => 
        product.price <= this.priceRange
      )
      
      // Apply search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        results = results.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.shortDescription.toLowerCase().includes(query)
        )
      }
      
      this.totalItems = results.length
      return results
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(price)
    },
    performSearch() {
      this.isLoading = true
      this.currentPage = 1
      
      // Simulate API call delay
      setTimeout(() => {
        this.searchResults = this.filteredResults
        this.isLoading = false
      }, 800)
    },
    applyFilters() {
      this.searchResults = this.filteredResults
    },
    applySorting() {
      switch (this.sortOption) {
        case 'price-low':
          this.searchResults.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          this.searchResults.sort((a, b) => b.price - a.price)
          break
        case 'newest':
          // Assuming newer items have higher IDs
          this.searchResults.sort((a, b) => b.id - a.id)
          break
        case 'rating':
          this.searchResults.sort((a, b) => b.rating - a.rating)
          break
        default:
          // Default is relevance (original order)
          this.searchResults = this.filteredResults
      }
    },
    resetFilters() {
      this.searchQuery = ''
      this.selectedCategories = []
      this.priceRange = 5000000
      this.sortOption = 'relevance'
      this.currentPage = 1
      this.searchResults = []
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.scrollToTop()
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.scrollToTop()
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    viewProduct(productId) {
      this.$router.push(`/products/${productId}`)
    },
    addToCart(product) {
      // Prevent event bubbling and add to cart logic
      event.stopPropagation()
      this.$emit('add-to-cart', product)
      alert(`${product.name} added to cart!`)
    }
  },
  mounted() {
    // Load initial search results if there's a query in route
    if (this.$route.query.q) {
      this.searchQuery = this.$route.query.q
      this.performSearch()
    }
  }
}
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.search-header {
  margin-bottom: 30px;
}

.search-bar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.search-bar {
  display: flex;
  width: 100%;
  max-width: 600px;
  border: 2px solid #3498db;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 2px 15px rgba(52, 152, 219, 0.2);
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-button {
  padding: 0 20px;
  background: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.search-button:hover {
  background: #2980b9;
}

.search-icon {
  font-size: 18px;
}

.search-filters {
  display: flex;
  gap: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.filter-section {
  flex: 1;
}

.filter-section h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #34495e;
  position: relative;
  padding-left: 25px;
}

.filter-option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: white;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
}

.filter-option:hover .checkmark {
  background-color: #f1f1f1;
}

.filter-option input:checked ~ .checkmark {
  background-color: #3498db;
  border-color: #3498db;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.filter-option input:checked ~ .checkmark:after {
  display: block;
}

.filter-option .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.range-slider {
  width: 100%;
  height: 6px;

  background: #d3d3d3;
  outline: none;
  border-radius: 3px;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3498db;
  cursor: pointer;
}

.price-values {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #7f8c8d;
}

.sort-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.search-results {
  min-height: 500px;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(52, 152, 219, 0.2);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.new-badge, .discount-badge {
  position: absolute;
  top: 10px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.new-badge {
  left: 10px;
  background: #2ecc71;
}

.discount-badge {
  right: 10px;
  background: #e74c3c;
}

.product-info {
  padding: 15px;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-description {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #7f8c8d;
  display: -webkit-box;

  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 36px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 12px;
}

.stars {
  color: #f39c12;
  font-size: 14px;
}

.rating-value {
  font-size: 13px;
  font-weight: bold;
  color: #2c3e50;
}

.review-count {
  font-size: 12px;
  color: #7f8c8d;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.current-price {
  font-weight: bold;
  color: #e74c3c;
  font-size: 16px;
}

.original-price {
  font-size: 13px;
  color: #7f8c8d;
  text-decoration: line-through;
}

.add-to-cart-btn {
  width: 100%;
  padding: 8px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-to-cart-btn:hover {
  background: #2980b9;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  text-align: center;
}

.no-results img {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.no-results h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.no-results p {
  margin: 0 0 20px 0;
  color: #7f8c8d;
}

.reset-filters-btn {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.reset-filters-btn:hover {
  background: #2980b9;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding: 20px 0;
}

.page-button {
  padding: 8px 16px;
  background: white;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-button:hover:not(:disabled) {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #7f8c8d;
  font-size: 14px;
}

@media (max-width: 768px) {
  .search-filters {
    flex-direction: column;
    gap: 20px;
  }
  
  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .search-bar {
    max-width: 100%;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .product-image {
    height: 150px;
  }
  
  .pagination {
    gap: 10px;
  }
}
</style>