<template>
	<main id="Home">
		<div class="home-page">
			<!-- Hero Section -->
			<section class="hero-section">
			<div class="hero-content">
				<h1>Welcome to Our Store</h1>
				<p>Discover amazing products at unbeatable prices</p>
				<router-link to="/produk" class="shop-now-btn">Shop Now</router-link>
			</div>
			<div class="hero-image">
				<img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Shopping experience">
			</div>
			</section>

			<!-- Categories Section -->
			<section class="categories-section">
			<h2>Shop by Category</h2>
			<div class="categories-grid">
				<div v-for="category in categories" :key="category.id" class="category-card">
				<router-link :to="`/products?category=${category.id}`">
					<img :src="category.image" :alt="category.name">
					<h3>{{ category.name }}</h3>
				</router-link>
				</div>
			</div>
			</section>

			<!-- Featured Products -->
			<section class="featured-products">
			<div class="section-header">
				<h2>Featured Products</h2>
				<router-link to="/produk" class="view-all">View All</router-link>
			</div>
			<div class="products-grid">
				<div v-for="product in featuredProducts" :key="product.id" class="product-card">
				<div class="product-image" @click="viewProduct(product.id)">
					<img :src="product.image" :alt="product.name">
					<div v-if="product.isNew" class="new-badge">New</div>
					<div v-if="product.discount" class="discount-badge">-{{ product.discount }}%</div>
					<button class="quick-view" @click.stop="quickView(product)">Quick View</button>
				</div>
				<div class="product-info">
					<h3 class="product-name" @click="viewProduct(product.id)">{{ product.name }}</h3>
					<div class="product-rating">
					<span class="stars">★★★★★</span>
					<span class="rating-value">{{ product.rating }}</span>
					<span class="review-count">({{ product.reviewCount }})</span>
					</div>
					<div class="product-price">
					<span class="current-price">Rp {{ formatPrice(product.price) }}</span>
					<span v-if="product.originalPrice" class="original-price">Rp {{ formatPrice(product.originalPrice) }}</span>
					</div>
					<button class="add-to-cart-btn" @click="addToCart(product)">Add to Cart</button>
				</div>
				</div>
			</div>
			</section>

			<!-- Promo Banner -->
			<section class="promo-banner">
			<div class="promo-content">
				<h2>Summer Sale</h2>
				<p>Up to 50% off selected items</p>
				<router-link to="/products?promo=summer-sale" class="shop-now-btn">Shop the Sale</router-link>
			</div>
			</section>

			<!-- Popular Products -->
			<section class="popular-products">
			<div class="section-header">
				<h2>Popular This Week</h2>
				<router-link to="/produk" class="view-all">View All</router-link>
			</div>
			<div class="products-grid">
				<div v-for="product in popularProducts" :key="product.id" class="product-card">
				<div class="product-image" @click="viewProduct(product.id)">
					<img :src="product.image" :alt="product.name">
					<div v-if="product.isNew" class="new-badge">New</div>
					<div v-if="product.discount" class="discount-badge">-{{ product.discount }}%</div>
				</div>
				<div class="product-info">
					<h3 class="product-name" @click="viewProduct(product.id)">{{ product.name }}</h3>
					<div class="product-rating">
					<span class="stars">★★★★★</span>
					<span class="rating-value">{{ product.rating }}</span>
					</div>
					<div class="product-price">
					<span class="current-price">Rp {{ formatPrice(product.price) }}</span>
					<span v-if="product.originalPrice" class="original-price">Rp {{ formatPrice(product.originalPrice) }}</span>
					</div>
					<button class="add-to-cart-btn" @click="addToCart(product)">Add to Cart</button>
				</div>
				</div>
			</div>
			</section>

			<!-- Testimonials -->
			<section class="testimonials">
			<h2>What Our Customers Say</h2>
			<div class="testimonials-grid">
				<div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-card">
				<div class="testimonial-content">
					<div class="stars">★★★★★</div>
					<p>"{{ testimonial.content }}"</p>
				</div>
				<div class="customer-info">
					<img :src="testimonial.avatar" :alt="testimonial.name" class="customer-avatar">
					<div>
					<h4>{{ testimonial.name }}</h4>
					<p class="customer-location">{{ testimonial.location }}</p>
					</div>
				</div>
				</div>
			</div>
			</section>

			<!-- Quick View Modal -->
			<div v-if="showQuickView" class="quick-view-modal">
			<div class="modal-overlay" @click="closeQuickView"></div>
			<div class="modal-content">
				<button class="close-modal" @click="closeQuickView">×</button>
				<div v-if="selectedProduct" class="quick-view-product">
				<div class="product-gallery">
					<img :src="selectedProduct.image" :alt="selectedProduct.name">
				</div>
				<div class="product-details">
					<h2>{{ selectedProduct.name }}</h2>
					<div class="product-meta">
					<div class="rating">
						<span class="stars">★★★★★</span>
						<span class="rating-value">{{ selectedProduct.rating }}</span>
						<span class="review-count">({{ selectedProduct.reviewCount }} reviews)</span>
					</div>
					<div class="availability in-stock">In Stock</div>
					</div>
					<div class="product-price">
					<span class="current-price">Rp {{ formatPrice(selectedProduct.price) }}</span>
					<span v-if="selectedProduct.originalPrice" class="original-price">
						Rp {{ formatPrice(selectedProduct.originalPrice) }}
					</span>
					<span v-if="selectedProduct.discount" class="discount-badge">
						-{{ selectedProduct.discount }}%
					</span>
					</div>
					<div class="product-description">
					<p>{{ selectedProduct.shortDescription }}</p>
					</div>
					<div class="product-actions">
					<div class="quantity-selector">
						<label>Quantity:</label>
						<div class="quantity-control">
						<button @click="decreaseQuantity" :disabled="quantity <= 1" class="quantity-btn">-</button>
						<input type="number" v-model.number="quantity" min="1">
						<button @click="increaseQuantity" class="quantity-btn">+</button>
						</div>
					</div>
					<button @click="addToCart(selectedProduct)" class="add-to-cart-btn">Add to Cart</button>
					<button class="buy-now-btn">Buy Now</button>
					</div>
				</div>
				</div>
			</div>
			</div>
		</div>
	</main>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      categories: [
        {
          id: 'electronics',
          name: 'Electronics',
          image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'fashion',
          name: 'Fashion',
          image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'home',
          name: 'Home & Living',
          image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'beauty',
          name: 'Beauty',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      ],
      featuredProducts: [
        {
          id: 1,
          name: 'Wireless Bluetooth Headphones',
          price: 1200000,
          originalPrice: 1500000,
          discount: 20,
          rating: 4.5,
          reviewCount: 128,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          shortDescription: 'Noise cancelling with 30hr battery life',
          isNew: true
        },
        {
          id: 2,
          name: 'Smart Watch Pro',
          price: 2500000,
          rating: 4.2,
          reviewCount: 86,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          shortDescription: 'Fitness tracker with heart rate monitor'
        },
        {
          id: 3,
          name: 'Organic Cotton T-Shirt',
          price: 250000,
          originalPrice: 350000,
          discount: 29,
          rating: 4.7,
          reviewCount: 215,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          shortDescription: '100% organic cotton, comfortable fit'
        },
        {
          id: 4,
          name: 'Ceramic Dinner Set',
          price: 850000,
          rating: 4.8,
          reviewCount: 42,
          image: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          shortDescription: 'Elegant 16-piece ceramic dinnerware set',
          isNew: true
        }
      ],
      popularProducts: [
        {
          id: 5,
          name: 'Yoga Mat',
          price: 350000,
          originalPrice: 450000,
          discount: 22,
          rating: 4.3,
          reviewCount: 97,
          image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          shortDescription: 'Non-slip, eco-friendly material'
        },
        {
          id: 6,
          name: 'Wireless Earbuds',
          price: 850000,
          originalPrice: 1000000,
          discount: 15,
          rating: 4.3,
          reviewCount: 156,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          shortDescription: 'True wireless with charging case',
          isNew: true
        },
        {
          id: 7,
          name: 'Bluetooth Speaker',
          price: 650000,
          rating: 4.1,
          reviewCount: 78,
          image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          shortDescription: 'Portable with 20hr battery life'
        },
        {
          id: 8,
          name: 'Leather Wallet',
          price: 450000,
          originalPrice: 600000,
          discount: 25,
          rating: 4.6,
          reviewCount: 64,
          image: 'https://images.unsplash.com/photo-1548032885-b5e38734688a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          shortDescription: 'Genuine leather with RFID protection'
        }
      ],
      testimonials: [
        {
          id: 1,
          name: 'Sarah Johnson',
          location: 'Jakarta',
          content: 'The products are amazing and the delivery was super fast! Will definitely shop here again.',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
          id: 2,
          name: 'Michael Chen',
          location: 'Bandung',
          content: 'Great customer service and high quality products. Very satisfied with my purchase.',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
          id: 3,
          name: 'David Wilson',
          location: 'Surabaya',
          content: 'Found exactly what I was looking for at a great price. The shopping experience was excellent.',
          avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
        }
      ],
      showQuickView: false,
      selectedProduct: null,
      quantity: 1
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(price)
    },
    viewProduct(productId) {
      this.$router.push(`/products/${productId}`)
    },
    quickView(product) {
      this.selectedProduct = product
      this.showQuickView = true
      document.body.style.overflow = 'hidden'
    },
    closeQuickView() {
      this.showQuickView = false
      document.body.style.overflow = 'auto'
    },
    addToCart(product) {
      this.$emit('add-to-cart', {
        ...product,
        quantity: this.quantity
      })
      alert(`${product.name} added to cart!`)
      this.closeQuickView()
    },
    increaseQuantity() {
      this.quantity++
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    }
  }
}
</script>

<style scoped>
.home-page {
  font-family: 'Arial', sans-serif;
  color: #2c3e50;
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 60px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content {
  flex: 1;
}

.hero-content h1 {
  font-size: 42px;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-content p {
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 30px;
}

.shop-now-btn {
  display: inline-block;
  padding: 12px 30px;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s;
}

.shop-now-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.hero-image {
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.hero-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* Categories Section */
.categories-section {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}

.categories-section h2 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.category-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.category-card a {
  display: block;
  text-decoration: none;
  color: inherit;
}

.category-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.category-card h3 {
  text-align: center;
  padding: 20px;
  margin: 0;
  font-size: 18px;
}

/* Products Section */
.featured-products,
.popular-products {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 32px;
  margin: 0;
}

.view-all {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.view-all:hover {
  color: #2980b9;
  text-decoration: underline;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  height: 250px;
  overflow: hidden;
  cursor: pointer;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
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

.quick-view {
  position: absolute;
  bottom: -40px;
  left: 0;
  right: 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  transition: bottom 0.3s;
  opacity: 0;
}

.product-card:hover .quick-view {
  bottom: 0;
  opacity: 1;
}

.product-info {
  padding: 20px;
}

.product-name {
  margin: 0 0 10px 0;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s;
}

.product-name:hover {
  color: #3498db;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.stars {
  color: #f39c12;
  font-size: 14px;
}

.rating-value {
  font-size: 13px;
  font-weight: bold;
}

.review-count {
  font-size: 12px;
  color: #7f8c8d;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.current-price {
  font-weight: bold;
  color: #e74c3c;
  font-size: 18px;
}

.original-price {
  font-size: 14px;
  color: #7f8c8d;
  text-decoration: line-through;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
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

/* Promo Banner */
.promo-banner {
  background: linear-gradient(135deg, #3498db, #2c3e50);
  color: white;
  padding: 80px 20px;
  text-align: center;
  margin: 60px 0;
}

.promo-content h2 {
  font-size: 36px;
  margin-bottom: 15px;
}

.promo-content p {
  font-size: 18px;
  margin-bottom: 25px;
}

.promo-banner .shop-now-btn {
  background: white;
  color: #3498db;
}

.promo-banner .shop-now-btn:hover {
  background: #f8f9fa;
  color: #2980b9;
}

/* Testimonials */
.testimonials {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
  text-align: center;
}

.testimonials h2 {
  font-size: 32px;
  margin-bottom: 40px;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.testimonial-card {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  text-align: left;
}

.testimonial-content .stars {
  color: #f39c12;
  font-size: 18px;
  margin-bottom: 15px;
}

.testimonial-content p {
  font-style: italic;
  color: #34495e;
  line-height: 1.6;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.customer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.customer-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.customer-location {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}

/* Quick View Modal */
.quick-view-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: white;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 10px;
  padding: 40px;
  z-index: 1001;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s;
}

.close-modal:hover {
  color: #e74c3c;
}

.quick-view-product {
  display: flex;
  gap: 40px;
}

.product-gallery {
  flex: 1;
}

.product-gallery img {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
}

.product-details {
  flex: 1;
}

.product-details h2 {
  font-size: 24px;
  margin-bottom: 15px;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.availability {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.in-stock {
  background: #e8f5e9;
  color: #4caf50;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
}

.product-description {
  margin-bottom: 25px;
  color: #34495e;
  line-height: 1.6;
}

.product-actions {
  margin-top: 30px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
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

.quantity-selector input {
  width: 50px;
  height: 30px;
  text-align: center;
  border: none;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}

.buy-now-btn {
  width: 100%;
  padding: 12px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

.buy-now-btn:hover {
  background: #27ae60;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
  }
  
  .hero-image {
    margin-top: 30px;
  }
  
  .quick-view-product {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 32px;
  }
  
  .section-header h2 {
    font-size: 28px;
  }
  
  .promo-content h2 {
    font-size: 28px;
  }
  
  .modal-content {
    padding: 30px 20px;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 28px;
  }
  
  .categories-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .promo-content h2 {
    font-size: 24px;
  }
  
  .promo-content p {
    font-size: 16px;
  }
}
</style>