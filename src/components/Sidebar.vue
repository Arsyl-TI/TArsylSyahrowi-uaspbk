<template>
	<aside :class="`${is_expanded ? 'is-expanded' : ''}`">
		<div class="logo">
			<img :src="logoURL" alt="Vue" /> 
		</div>

		<div class="menu-toggle-wrap">
			<button class="menu-toggle" @click="ToggleMenu">
				<span class="material-icons">keyboard_double_arrow_right</span>
			</button>
		</div>

		<h3>Menu</h3>
		<div class="menu">
			<router-link to="/" class="button"  @click="is_expanded = false">
				<span class="material-icons">home</span>
				<span class="text">Home</span>
			</router-link>
      		<router-link to="/search" class="button">
				<span class="material-icons">search</span>
				<span class="text">Pencarian</span>
			</router-link>
      		<router-link to="/produk" class="button">
				<span class="material-icons">shopping_bag</span>
				<span class="text">produk</span>
			</router-link>
			<router-link to="/keranjang" class="button">
				<span class="material-icons">shopping_cart</span>
				<span class="text">Keranjang Belanja</span>
			</router-link>
			<router-link to="/riwayat-transaksi" class="button">
				<span class="material-icons">history</span>
				<span class="text">Transaksi</span>
			</router-link>
			<router-link v-if="!isAuthenticated" to="/login" class="button"> 
				<span class="material-icons">login</span>
				<span class="text">Login</span>
			</router-link>
			<router-link v-if="!isAuthenticated" to="/register" class="button"> 
				<span class="material-icons">add_box</span>
				<span class="text">Register</span>
			</router-link>
			<router-link to="/akun" class="button"> 
				<span class="material-icons">account_circle</span>
				<span class="text">Akun</span>
			</router-link>
			<button v-if="isAuthenticated" class="button" @click="userStore.logout()">
        		<span class="material-icons">logout</span>
        		<span class="text">Logout</span>
      		</button>
			<router-link to="/databarang" class="button"> 
				<span class="material-icons">inventory_2</span>
				<span class="text">Data Barang</span>
			</router-link>
			<router-link to="/contact" class="button"> 
				<span class="material-icons">contacts</span>
				<span class="text">Contact Us</span>
			</router-link>
		</div>

		<div class="flex"></div>
		
		<div class="menu">
			<router-link to="/settings" class="button">
				<span class="material-icons">settings</span>
				<span class="text">Settings</span>
			</router-link>
		</div>
	</aside>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import logoURL from '../assets/logo.png'

const userStore = useUserStore()
const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

const ToggleMenu = () => {
	is_expanded.value = !is_expanded.value
	localStorage.setItem("is_expanded", is_expanded.value)
}

</script>

<style lang="scss" scoped>
aside {
	display: flex;
	flex-direction: column;

	background-color: var(--dark);
	color: var(--light);

	width: calc(2rem + 32px);
	overflow: hidden;
	min-height: 100vh;
	padding: 1rem;

	transition: 0.2s ease-in-out;

.flex {
	flex: 1 1 0%;
}

.logo {
	margin-bottom: 1rem;

	img {
		width: 2rem;
	}
}

.menu-toggle-wrap {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 1rem;

	position: relative;
	top: 0;
	transition: 0.2s ease-in-out;

.menu-toggle {
	transition: 0.2s ease-in-out;
.material-icons {
	font-size: 2rem;
	color: var(--light);
	transition: 0.2s ease-out;
}			
&:hover {
	.material-icons {
		color: var(--primary);
		transform: translateX(0.5rem);
		}
	}
}
}
h3, .button .text {
	opacity: 0;
	transition: opacity 0.3s ease-in-out;
}

h3 {
	color: var(--grey);
	font-size: 0.875rem;
	margin-bottom: 0.5rem;
	text-transform: uppercase;
}

.menu {
	margin: 0 -1rem;

.button {
	display: flex;
	align-items: center;
	text-decoration: none;

			transition: 0.2s ease-in-out;
			padding: 0.5rem 1rem;

			.material-icons {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-in-out;
			}
			.text {
				color: var(--light);
				transition: 0.2s ease-in-out;
			}

			&:hover {
				background-color: var(--dark-alt);

				.material-icons, .text {
					color: var(--primary);
				}
			}

			&.router-link-exact-active {
				background-color: var(--dark-alt);
				border-right: 5px solid var(--primary);

				.material-icons, .text {
					color: var(--primary);
				}
			}
		}
	}

	.footer {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;

		p {
			font-size: 0.875rem;
			color: var(--grey);
		}
	}

	&.is-expanded {
		width: var(--sidebar-width);

		.menu-toggle-wrap {
			top: -3rem;
			
			.menu-toggle {
				transform: rotate(-180deg);
			}
		}

		h3, .button .text {
			opacity: 1;
		}

		.button {
			.material-icons {
				margin-right: 1rem;
			}
		}

		.footer {
			opacity: 0;
		}
	}

	@media (max-width: 1024px) {
		position: absolute;
		z-index: 99;
	}
}
</style>