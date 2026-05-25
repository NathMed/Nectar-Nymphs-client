<script>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api.js';

export default {
    setup() {
        const notyf = new Notyf();
        const router = useRouter();
        const cart = ref(null);
        const isLoading = ref(true);

        async function getAllItems() {
            isLoading.value = true;
            try {
                const { data } = await api.get('/cart/get-cart');
                cart.value = data.cart;
            } catch (e) {
                notyf.error(e.response?.data?.message || e.response?.data?.error || 'Unable to load cart.');
            } finally {
                isLoading.value = false;
            }
        }

        async function updateQuantity(productId, newQty) {
            if (newQty < 1) return;
            try {
                await api.patch('/cart/update-cart-quantity', {
                    productId,
                    newQuantity: newQty
                });
                await getAllItems();
            } catch (e) {
                notyf.error(e.response?.data?.message || e.response?.data?.error || 'Unable to update quantity.');
            }
        }

        async function checkout() {
            try {
                const { data } = await api.post('/orders/checkout');
                notyf.success(data.message);
                await getAllItems();
                router.push({ path: '/orders' });
            } catch (e) {
                notyf.error(e.response?.data?.message || e.response?.data?.error);
            }
        }

        onBeforeMount(getAllItems);

        return { 
            cart, 
            isLoading, 
            updateQuantity, 
            checkout 
        };
    }
}
</script>

<template>
    <div class="container my-5">
        <h2 class="text-center mb-4">Your Shopping Cart</h2>

        <div v-if="isLoading" class="text-center py-5">
            <p class="text-muted">Loading cart...</p>
        </div>

        <div v-else-if="!cart || cart.cartItems.length === 0" class="text-center py-5">
            <h5 class="text-muted">Your cart is empty.</h5>
            <router-link :to="{ path: '/products' }" class="btn btn-primary mt-3">
                Browse Products
            </router-link>
        </div>

        <div v-else>
            <table class="table table-bordered align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cart.cartItems" :key="item._id">
                        <td class="text-uppercase fw-semibold">{{ item.name }}</td>
                        <td>
                            <div class="d-flex align-items-center gap-2">
                                <button class="btn btn-sm btn-dark px-3"
                                    @click="updateQuantity(item.productId, item.quantity - 1)">-</button>
                                <span class="border px-3 py-1">{{ item.quantity }}</span>
                                <button class="btn btn-sm btn-dark px-3"
                                    @click="updateQuantity(item.productId, item.quantity + 1)">+</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="mt-3">
                <button class="btn btn-success" @click="checkout">Checkout</button>
            </div>
        </div>

    </div>
</template>