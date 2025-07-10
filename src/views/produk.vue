<template>
	<main id="produk-page">
		<div class="product-page">
			<!-- Breadcrumb Navigation -->
			<div class="breadcrumb">
			<router-link to="/">Home</router-link>
			<span> / </span>
			<router-link to="/produk">Produk</router-link>
			<span> / </span>
			<span>{{ product.name }}</span>
			</div>

			<div class="product-container">
			<!-- Product Images Gallery -->
			<div class="product-gallery">
				<div class="main-image">
				<img :src="selectedImage || product.images[0]" :alt="product.name" />
				</div>
				<div class="thumbnail-container">
				<div
					v-for="(image, index) in product.images"
					:key="index"
					class="thumbnail"
					:class="{ active: selectedImage === image }"
					@click="selectedImage = image"
				>
					<img :src="image" :alt="'Thumbnail ' + (index + 1)" />
				</div>
				</div>
			</div>

			<!-- Product Details -->
			<div class="product-details">
				<h1 class="product-title">{{ product.name }}</h1>
				
				<div class="product-meta">
				<div class="rating">
					<span class="stars">★★★★★</span>
					<span class="rating-value">{{ product.rating }}</span>
					<span class="review-count">({{ product.reviewCount }} reviews)</span>
					<router-link to="#reviews" class="see-all">See all reviews</router-link>
				</div>
				
				<div class="availability" :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
					{{ product.inStock ? 'In Stock' : 'Out of Stock' }}
				</div>
				
				<div class="sku">SKU: {{ product.sku }}</div>
				</div>

				<div class="product-price">
				<span class="current-price">Rp {{ formatPrice(product.price) }}</span>
				<span v-if="product.originalPrice" class="original-price">
					Rp {{ formatPrice(product.originalPrice) }}
				</span>
				<span v-if="product.discount" class="discount-badge">
					-{{ product.discount }}%
				</span>
				</div>

				<div class="product-description">
				<p>{{ product.description }}</p>
				</div>

				<!-- Product Variants -->
				<div class="product-variants" v-if="product.variants && product.variants.length > 0">
				<div class="variant" v-for="variant in product.variants" :key="variant.id">
					<h4>{{ variant.name }}</h4>
					<div class="variant-options">
					<button
						v-for="option in variant.options"
						:key="option.id"
						class="variant-option"
						:class="{
						selected: selectedVariants[variant.id] === option.id,
						disabled: !option.available
						}"
						@click="selectVariant(variant.id, option.id)"
						:disabled="!option.available"
					>
						{{ option.name }}
					</button>
					</div>
				</div>
				</div>

				<!-- Quantity Selector -->
				<div class="quantity-selector">
				<label>Quantity:</label>
				<div class="quantity-control">
					<button @click="decreaseQuantity" :disabled="quantity <= 1" class="quantity-btn">
					-
					</button>
					<input type="number" v-model.number="quantity" min="1" :max="product.stock" />
					<button @click="increaseQuantity" :disabled="quantity >= product.stock" class="quantity-btn">
					+
					</button>
				</div>
				<div class="stock-info" v-if="product.stock > 0">
					{{ product.stock }} available
				</div>
				</div>

				<!-- Action Buttons -->
				<div class="product-actions">
				<button
					@click="addToCart"
					class="add-to-cart-btn"
					:disabled="!product.inStock || isAddingToCart"
				>
					<span v-if="!isAddingToCart">Add to Cart</span>
					<span v-else class="spinner"></span>
				</button>
				<button class="buy-now-btn" :disabled="!product.inStock">
					Buy Now
				</button>
				<button class="wishlist-btn">
					<i class="heart-icon">❤</i> Add to Wishlist
				</button>
				</div>

				<!-- Product Tabs -->
				<div class="product-tabs">
				<div class="tabs-header">
					<button
					v-for="tab in tabs"
					:key="tab.id"
					class="tab-btn"
					:class="{ active: activeTab === tab.id }"
					@click="activeTab = tab.id"
					>
					{{ tab.label }}
					</button>
				</div>
				<div class="tabs-content">
					<div v-if="activeTab === 'description'" class="tab-panel">
					<h3>Product Description</h3>
					<div v-html="product.fullDescription"></div>
					</div>
					<div v-if="activeTab === 'specs'" class="tab-panel">
					<h3>Specifications</h3>
					<table class="specs-table">
						<tr v-for="spec in product.specifications" :key="spec.name">
						<th>{{ spec.name }}</th>
						<td>{{ spec.value }}</td>
						</tr>
					</table>
					</div>
					<div v-if="activeTab === 'reviews'" class="tab-panel" id="reviews">
					<h3>Customer Reviews</h3>
					<div class="review-summary">
						<div class="average-rating">
						<span class="average">{{ product.rating }}</span>
						<span class="stars">★★★★★</span>
						<span class="total-reviews">{{ product.reviewCount }} reviews</span>
						</div>
						<div class="rating-distribution">
						<div v-for="i in 5" :key="i" class="rating-bar">
							<span class="stars">{{ 6 - i }}★</span>
							<div class="bar-container">
							<div
								class="bar"
								:style="{ width: getRatingPercentage(6 - i) + '%' }"
							></div>
							</div>
							<span class="percentage">{{ getRatingPercentage(6 - i) }}%</span>
						</div>
						</div>
					</div>
					<div class="reviews-list">
						<div v-for="review in product.reviews" :key="review.id" class="review">
						<div class="review-header">
							<div class="reviewer">{{ review.reviewer }}</div>
							<div class="review-date">{{ formatDate(review.date) }}</div>
							<div class="review-rating">
							<span class="stars">★★★★★</span>
							<span class="rating-value">{{ review.rating }}</span>
							</div>
						</div>
						<div class="review-content">
							<h4>{{ review.title }}</h4>
							<p>{{ review.content }}</p>
						</div>
						</div>
					</div>
					<button class="load-more-btn">Load More Reviews</button>
					</div>
				</div>
				</div>
			</div>
			</div>

			<!-- Related Products -->
			<div class="related-products" v-if="relatedProducts.length > 0">
			<h2>You may also like</h2>
			<div class="products-grid">
				<div
				v-for="product in relatedProducts"
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
					<div class="product-rating">
					<span class="stars">★★★★★</span>
					<span class="rating-value">{{ product.rating }}</span>
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
			</div>
		</div>
	</main>
</template>

<script>
export default {
  name: 'ProductPage',
  data() {
    return {
      selectedImage: null,
      selectedVariants: {},
      quantity: 1,
      activeTab: 'description',
      isAddingToCart: false,
      tabs: [
        { id: 'description', label: 'Description' },
        { id: 'specs', label: 'Specifications' },
        { id: 'reviews', label: 'Reviews' }
      ],
      product: {
        id: 1,
        name: 'Premium Wireless Headphones',
        sku: 'HP-2023-BLK',
        description: 'Experience crystal-clear sound with our premium wireless headphones featuring active noise cancellation.',
        fullDescription: `
          <p>The Premium Wireless Headphones deliver an unparalleled audio experience with advanced noise cancellation technology. 
          Perfect for music lovers and professionals alike, these headphones provide up to 30 hours of playtime on a single charge.</p>
          <ul>
            <li>Active Noise Cancellation (ANC) technology</li>
            <li>30-hour battery life with quick charge (5 mins charge = 3 hours playback)</li>
            <li>Bluetooth 5.0 with 10m range</li>
            <li>Built-in microphone for hands-free calls</li>
            <li>Soft memory foam ear cushions for all-day comfort</li>
          </ul>
        `,
        price: 1250000,
        originalPrice: 1500000,
        discount: 17,
        rating: 4.5,
        reviewCount: 128,
        inStock: true,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        ],
        variants: [
          {
            id: 'color',
            name: 'Color',
            options: [
              { id: 'black', name: 'Black', available: true },
              { id: 'white', name: 'White', available: true },
              { id: 'blue', name: 'Blue', available: false },
              { id: 'red', name: 'Red', available: true }
            ]
          },
          {
            id: 'size',
            name: 'Size',
            options: [
              { id: 'small', name: 'Small', available: true },
              { id: 'medium', name: 'Medium', available: true },
              { id: 'large', name: 'Large', available: true }
            ]
          }
        ],
        specifications: [
          { name: 'Brand', value: 'AudioMaster' },
          { name: 'Model', value: 'HP-2023' },
          { name: 'Connectivity', value: 'Bluetooth 5.0' },
          { name: 'Battery Life', value: '30 hours' },
          { name: 'Charging Time', value: '2 hours' },
          { name: 'Weight', value: '250g' },
          { name: 'Warranty', value: '1 year' }
        ],
        reviews: [
          {
            id: 1,
            reviewer: 'John D.',
            date: '2023-05-15',
            rating: 5,
            title: 'Amazing sound quality!',
            content: 'These headphones exceeded my expectations. The noise cancellation is incredible and the battery life is as advertised.'
          },
          {
            id: 2,
            reviewer: 'Sarah M.',
            date: '2023-04-28',
            rating: 4,
            title: 'Great headphones with minor issues',
            content: 'Love the sound quality and comfort, but the touch controls can be a bit sensitive sometimes.'
          }
        ],
        ratingDistribution: {
          5: 85,
          4: 10,
          3: 3,
          2: 1,
          1: 1
        }
      },
      relatedProducts: [
        {
          id: 2,
          name: 'Wireless Earbuds Pro',
          price: 850000,
          originalPrice: 1000000,
          discount: 15,
          rating: 4.3,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          isNew: true
        },
        {
          id: 3,
          name: 'Bluetooth Speaker',
          price: 650000,
          rating: 4.1,
          image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 4,
          name: 'Studio Monitor Headphones',
          price: 1750000,
          originalPrice: 2000000,
          discount: 13,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 5,
          name: 'Portable DAC Amplifier',
          price: 950000,
          rating: 4.4,
          image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          isNew: true
        }
      ]
    }
  },
  created() {
    // Initialize selected variants with first available option
    this.product.variants.forEach(variant => {
      const availableOption = variant.options.find(option => option.available)
      if (availableOption) {
        this.selectedVariants[variant.id] = availableOption.id
      }
    })
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(price)
    },
    selectVariant(variantId, optionId) {
      this.selectedVariants[variantId] = optionId
    },
    increaseQuantity() {
      if (this.quantity < this.product.stock) {
        this.quantity++
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    addToCart(product = null) {
      const itemToAdd = product || {
        ...this.product,
        selectedVariants: { ...this.selectedVariants }
      }
      
      this.isAddingToCart = true
      
      // Simulate API call
      setTimeout(() => {
        this.isAddingToCart = false
        this.$emit('add-to-cart', {
          ...itemToAdd,
          quantity: this.quantity
        })
        alert(`${itemToAdd.name} added to cart!`)
      }, 1000)
    },
    viewProduct(productId) {
      this.$router.push(`/products/${productId}`)
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    },
    getRatingPercentage(rating) {
      return this.product.ratingDistribution[rating] || 0
    }
  }
}
</script>

<style scoped>
.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
  color: #7f8c8d;
}

.breadcrumb a {
  color: #3498db;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb span {
  margin: 0 5px;
}

.product-container {
  display: flex;
  gap: 40px;
  margin-bottom: 60px;
}

.product-gallery {
  flex: 1;
}

.main-image {
  width: 100%;
  height: 500px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumbnail-container {
  display: flex;
  gap: 10px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s;
}

.thumbnail:hover,
.thumbnail.active {
  border-color: #3498db;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.product-title {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 15px;
}

.product-meta {
  margin-bottom: 20px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.stars {
  color: #f39c12;
  font-size: 16px;
}

.rating-value {
  font-weight: bold;
  margin-right: 5px;
}

.review-count,
.see-all {
  font-size: 14px;
  color: #7f8c8d;
}

.see-all {
  margin-left: 10px;
  color: #3498db;
  text-decoration: none;
}

.see-all:hover {
  text-decoration: underline;
}

.availability {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
}

.availability.in-stock {
  color: #2ecc71;
}

.availability.out-of-stock {
  color: #e74c3c;
}

.sku {
  font-size: 14px;
  color: #7f8c8d;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
}

.current-price {
  font-size: 24px;
  font-weight: bold;
  color: #e74c3c;
}

.original-price {
  font-size: 18px;
  color: #7f8c8d;
  text-decoration: line-through;
}

.discount-badge {
  background: #e74c3c;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

.product-description {
  margin-bottom: 25px;
  color: #34495e;
  line-height: 1.6;
}

.product-variants {
  margin: 25px 0;
}

.variant {
  margin-bottom: 20px;
}

.variant h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #2c3e50;
}

.variant-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.variant-option {
  padding: 8px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.variant-option:hover:not(.disabled) {
  border-color: #3498db;
  color: #3498db;
}

.variant-option.selected {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.variant-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  text-decoration: line-through;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 25px 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  background: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-selector input {
  width: 50px;
  height: 30px;
  text-align: center;
  border: none;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}

.stock-info {
  font-size: 14px;
  color: #7f8c8d;
}

.product-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 30px 0;
}

.add-to-cart-btn,
.buy-now-btn,
.wishlist-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn {
  background: #3498db;
  color: white;
  flex: 2;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #2980b9;
}

.add-to-cart-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.buy-now-btn {
  background: #2ecc71;
  color: white;
  flex: 2;
}

.buy-now-btn:hover:not(:disabled) {
  background: #27ae60;
}

.buy-now-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.wishlist-btn {
  background: white;
  color: #2c3e50;
  border: 1px solid #e0e0e0;
  flex: 1;
}

.wishlist-btn:hover {
  background: #f8f9fa;
}

.heart-icon {
  margin-right: 5px;
  color: #e74c3c;
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

.product-tabs {
  margin-top: 40px;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab-btn {
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 16px;
  font-weight: 500;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  color: #3498db;
  border-bottom-color: #3498db;
}

.tab-btn:hover:not(.active) {
  color: #2c3e50;
}

.tabs-content {
  padding: 20px 0;
}

.tab-panel h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table tr {
  border-bottom: 1px solid #eee;
}

.specs-table th,
.specs-table td {
  padding: 12px 15px;
  text-align: left;
}

.specs-table th {
  color: #2c3e50;
  font-weight: 500;
  width: 30%;
}

.specs-table td {
  color: #34495e;
}

.review-summary {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.average {
  font-size: 36px;
  font-weight: bold;
  color: #2c3e50;
}

.rating-distribution {
  flex: 1;
}

.rating-bar {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.stars {
  min-width: 40px;
  color: #f39c12;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin: 0 10px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #f39c12;
  border-radius: 4px;
}

.percentage {
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  color: #7f8c8d;
}

.reviews-list {
  margin-bottom: 20px;
}

.review {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.review-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.reviewer {
  font-weight: 500;
  color: #2c3e50;
}

.review-date {
  color: #7f8c8d;
  font-size: 14px;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.review-rating .stars {
  font-size: 14px;
}

.rating-value {
  font-size: 14px;
  font-weight: bold;
}

.review-content h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 16px;
}

.review-content p {
  margin: 0;
  color: #34495e;
  line-height: 1.6;
}

.load-more-btn {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background: white;
  border: 1px solid #3498db;
  color: #3498db;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.load-more-btn:hover {
  background: #f0f7fd;
}

.related-products {
  margin-top: 60px;
}

.related-products h2 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.products-grid {
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

.new-badge,
.discount-badge {
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

.product-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.product-rating .stars {
  font-size: 14px;
  color: #f39c12;
}

.rating-value {
  font-size: 13px;
  font-weight: bold;
  color: #2c3e50;
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

@media (max-width: 992px) {
  .product-container {
    flex-direction: column;
  }
  
  .main-image {
    height: 400px;
  }
  
  .review-summary {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .product-actions {
    flex-direction: column;
  }
  
  .add-to-cart-btn,
  .buy-now-btn,
  .wishlist-btn {
    flex: 1;
    width: 100%;
  }
  
  .tabs-header {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 5px;
  }
  
  .tab-btn {
    padding: 10px 15px;
  }
}

@media (max-width: 480px) {
  .main-image {
    height: 300px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .variant-options {
    gap: 5px;
  }
  
  .variant-option {
    padding: 6px 10px;
    font-size: 14px;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>