<script>
import { ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import { useGlobalStore } from '../stores/global.js';
import api from '../api.js';

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const notyf = new Notyf();
        const product = ref(null);
        const isLoading = ref(true);
        const quantity = ref(1);

        const store = useGlobalStore();
        const user = store.user;

        async function fetchProduct() {
            try {
                const { data } = await api.get(`/products/${route.params.id}`);
                product.value = data;
            } catch (e) {
                notyf.error(e.response?.data?.message || 'Product not found.');
                router.push({ path: '/products' });
            } finally {
                isLoading.value = false;
            }
        }

        function increment() {
            quantity.value++;
        }

        function decrement() {
            if (quantity.value > 1) quantity.value--;
        }

        async function addToCart() {
            try {

                if (!user.email) {
                    notyf.error('Please login to your account.');
                    router.push({
                        path: '/login',
                    });

                    return;
                }

                await api.post('/cart/add-to-cart', {
                    name: product.value.name,
                    productId: product.value._id,
                    quantity: quantity.value,
                    subtotal: product.value.price * quantity.value
                });
                notyf.success('Added to cart!');
            } catch (e) {
                notyf.error(e.response.data.message || 'Failed to add to cart.');
            }
        }

        onBeforeMount(fetchProduct);

        return { 
            product, 
            isLoading, 
            quantity, 
            increment, 
            decrement, 
            addToCart };
    }
}
</script>

<template>
    <div class="container py-5">

        <!-- Loading -->
        <div v-if="isLoading" class="d-flex flex-column align-items-center justify-content-center py-5">
            <div class="spinner-border text-warning mb-3"></div>
            <p class="text-muted">
                Loading product...
            </p>
        </div>

        <!-- Product Details -->
        <div v-else-if="product" class="row justify-content-center">
            <div class="mb-4">
                <router-link :to="{ path: '/products' }" class="btn back-btn">
                    ← Back to Products
                </router-link>
            </div>
            <div class="col-lg-10">
                <div class="card details-card border-0 overflow-hidden">
                    <div class="row g-0">
                        <div class="col-lg-6">
                            <div class="details-image d-flex align-items-center justify-content-center">
                                <span class="details-image-text">
                                    Nectar & Nymphs
                                </span>
                            </div>
                        </div>

                        <!-- Product Info -->

                        <div class="col-lg-6">
                            <div class="card-body p-4 p-lg-5 d-flex flex-column h-100">
                                <div class="mb-4">
                                    <p class="product-category mb-2">
                                        Artisan Pastry
                                    </p>
                                    <h1 class="details-title">
                                        {{ product.name }}
                                    </h1>
                                </div>
                                <p class="details-description">
                                    {{ product.description }}
                                </p>
                                <div class="mt-4">
                                    <h2 class="details-price">
                                        ₱{{ product.price }}
                                    </h2>
                                </div>

                                <!-- Quantity -->
                                <div class="mt-4">
                                    <p class="quantity-label mb-2">
                                        Quantity
                                    </p>
                                    <div class="d-flex align-items-center gap-3">
                                        <button class="btn quantity-btn" @click="decrement">
                                            −
                                        </button>
                                        <span class="quantity-display">
                                            {{ quantity }}
                                        </span>
                                        <button class="btn quantity-btn" @click="increment">
                                            +
                                        </button>
                                    </div>
                                </div>

                                <!-- Subtotal -->
                                <div class="subtotal-box mt-4">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span>Subtotal</span>
                                        <span class="subtotal-price">
                                            ₱{{ product.price * quantity }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Add To Cart -->
                                <button class="btn add-cart-btn mt-4" @click="addToCart">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

    .back-btn {
        background: transparent;
        border: 1.5px solid #d9c8b8;
        color: #5a3e2b;
        border-radius: 12px;
        padding: 0.7rem 1.2rem;
        font-weight: 700;
        transition: all 0.2s ease;
    }

    .back-btn:hover {
        background: #2c1f14;
        color: white;
        border-color: #2c1f14;
    }

    .container {
        font-family: 'Lato', sans-serif;
    }

    .details-card {
        border-radius: 24px;
        background: #fffdfb;
        box-shadow: 0 15px 50px rgba(44,31,20,0.08);
    }

    .details-image {
        min-height: 100%;
        height: 100%;
        min-height: 550px;
        background:
            linear-gradient(rgba(44,31,20,0.35), rgba(44,31,20,0.35)),
            url('../assets/images/placeholder-image.jpg');
        background-size: cover;
        background-position: center;
    }

    .details-image-text {
        color: white;
        font-family: 'Playfair Display', serif;
        font-size: 2rem;
    }

    .product-category {
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 0.75rem;
        color: #c8a97e;
        font-weight: 700;
    }

    .details-title {
        font-family: 'Playfair Display', serif;
        color: #2c1f14;
        font-size: 2.5rem;
        font-weight: 700;
    }

    .details-description {
        color: #7c6754;
        line-height: 1.9;
        font-size: 1rem;
    }

    .details-price {
        color: #c97d60;
        font-weight: 700;
    }

    .quantity-label {
        color: #5a3e2b;
        font-weight: 700;
    }

    .quantity-btn {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        border: 1px solid #e6d9cc;
        background: white;
        font-size: 1.2rem;
        font-weight: 700;
    }

    .quantity-btn:hover {
        background: #2c1f14;
        color: white;
    }

    .quantity-display {
        min-width: 60px;
        text-align: center;
        border: 1px solid #e6d9cc;
        border-radius: 10px;
        padding: 0.55rem 1rem;
    }

    .subtotal-box {
        background: #f9f3ed;
        border-radius: 14px;
        padding: 1rem 1.2rem;
        color: #5a3e2b;
    }

    .subtotal-price {
        color: #c97d60;
        font-weight: 700;
        font-size: 1.1rem;
    }

    .add-cart-btn {
        background: #2c1f14;
        color: white;
        border-radius: 14px;
        padding: 0.9rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        border: none;
    }

    .add-cart-btn:hover {
        background: #c8a97e;
        color: #2c1f14;
    }

    @media (max-width: 991px) {

        .details-image {
            min-height: 300px;
        }

        .details-title {
            font-size: 2rem;
        }
    }
</style>