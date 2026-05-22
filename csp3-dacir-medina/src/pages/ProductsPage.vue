<script setup>
    import { ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    import api from '../api.js';

    const products = ref([]);
    const isLoading = ref(true);
    const notyf = new Notyf();

    async function fetchProducts() {
        try {
            const { data } = await api.get('/products/active');
            products.value = data;
        } catch (error) {
            notyf.error(error.response?.data?.message || 'Unable to load products.');
        } finally {
            isLoading.value = false;
        }
    }

    onBeforeMount(fetchProducts);
</script>

<template>
    <div class="container my-5">
        <h1 class="text-center mb-5">Our Products</h1>

        <div v-if="isLoading" class="text-center">
            <p>Loading products...</p>
        </div>

        <div v-else-if="products.length === 0" class="text-center">
            <h4>No active products found.</h4>
        </div>

        <div class="row g-4" v-else>
            <div class="col-md-4" v-for="product in products" :key="product._id">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-primary text-center text-uppercase">
                            {{ product.name }}
                        </h5>

                        <p class="card-text mt-4 flex-grow-1">
                            {{ product.description }}
                        </p>

                        <p class="text-danger fs-5">
                            ₱{{ product.price }}
                        </p>
                    </div>

                    <div class="card-footer bg-light">
                        <button class="btn btn-primary w-100" type="button" disabled>
                            Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
