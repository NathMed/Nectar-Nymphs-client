<script>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api.js';

export default {
    setup() {
        const router = useRouter();
        const notyf = new Notyf();

        const cart = ref(null);
        const productDetails = ref({});
        const isLoading = ref(true);
        const isUpdating = ref(false);

        function getCartItems() {
            return cart.value?.cartItems || [];
        }

        function getProductId(item) {
            if (typeof item.productId === 'object') {
                return item.productId._id;
            }

            return item.productId;
        }

        function getItemName(item) {
            const productId = getProductId(item);

            return item.name || productDetails.value[productId]?.name || 'Product';
        }

        function getItemPrice(item) {
            const productId = getProductId(item);

            if (item.price) {
                return Number(item.price);
            }

            if (productDetails.value[productId]?.price) {
                return Number(productDetails.value[productId].price);
            }

            if (item.subtotal && item.quantity) {
                return Number(item.subtotal) / Number(item.quantity);
            }

            return 0;
        }

        function getItemSubtotal(item) {
            if (item.subtotal) {
                return Number(item.subtotal);
            }

            return getItemPrice(item) * Number(item.quantity);
        }

        const totalPrice = computed(() => {
            if (cart.value?.totalPrice) {
                return Number(cart.value.totalPrice);
            }

            return getCartItems().reduce((total, item) => {
                return total + getItemSubtotal(item);
            }, 0);
        });

        async function loadProductDetails() {
            const items = getCartItems();

            await Promise.all(items.map(async (item) => {
                const productId = getProductId(item);

                if (!productId || productDetails.value[productId]) {
                    return;
                }

                try {
                    const { data } = await api.get(`/products/${productId}`);
                    productDetails.value[productId] = data;
                } catch (error) {
                    productDetails.value[productId] = {
                        name: 'Product',
                        price: getItemPrice(item)
                    };
                }
            }));
        }

        async function getAllItems() {
            isLoading.value = true;

            try {
                const { data } = await api.get('/cart/get-cart');

                cart.value = data.cart || {
                    cartItems: [],
                    totalPrice: 0
                };

                await loadProductDetails();
            } catch (error) {
                cart.value = {
                    cartItems: [],
                    totalPrice: 0
                };

                notyf.error(error.response?.data?.message || error.response?.data?.error || 'Unable to load cart.');
            } finally {
                isLoading.value = false;
            }
        }

        async function updateQuantity(productId, newQuantity) {
            if (newQuantity < 1 || isUpdating.value) {
                return;
            }

            isUpdating.value = true;

            try {
                await api.patch('/cart/update-cart-quantity', {
                    productId: productId,
                    newQuantity: newQuantity
                });

                await getAllItems();
            } catch (error) {
                notyf.error(error.response?.data?.message || error.response?.data?.error || 'Unable to update quantity.');
            } finally {
                isUpdating.value = false;
            }
        }

        async function removeItem(productId) {
            if (isUpdating.value) {
                return;
            }

            isUpdating.value = true;

            try {
                await api.patch(`/cart/${productId}/remove-from-cart`);

                notyf.success('Item removed from cart.');
                await getAllItems();
            } catch (error) {
                notyf.error(error.response?.data?.message || error.response?.data?.error || 'Unable to remove item.');
            } finally {
                isUpdating.value = false;
            }
        }

        async function clearCart() {
            if (isUpdating.value) {
                return;
            }

            isUpdating.value = true;

            try {
                await api.put('/cart/clear-cart');

                notyf.success('Cart cleared successfully.');
                await getAllItems();
            } catch (error) {
                notyf.error(error.response?.data?.message || error.response?.data?.error || 'Unable to clear cart.');
            } finally {
                isUpdating.value = false;
            }
        }

        async function checkout() {
            if (getCartItems().length === 0) {
                notyf.error('Your cart is empty.');
                return;
            }

            try {
                const { data } = await api.post('/orders/checkout');

                notyf.success(data.message || 'Checkout successful.');
                await getAllItems();
                router.push({ path: '/products' });
            } catch (error) {
                notyf.error(error.response?.data?.message || error.response?.data?.error || 'Checkout failed.');
            }
        }

        onBeforeMount(getAllItems);

        return {
            cart,
            isLoading,
            isUpdating,
            totalPrice,
            getCartItems,
            getProductId,
            getItemName,
            getItemPrice,
            getItemSubtotal,
            updateQuantity,
            removeItem,
            clearCart,
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

        <div v-else-if="getCartItems().length === 0" class="text-center py-5">
            <h5 class="text-muted">Your cart is empty.</h5>

            <router-link :to="{ path: '/products' }" class="btn btn-primary mt-3">
                Browse Products
            </router-link>
        </div>

        <div v-else>
            <div class="table-responsive">
                <table class="table table-bordered align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in getCartItems()" :key="getProductId(item)">
                            <td class="text-uppercase fw-semibold">
                                {{ getItemName(item) }}
                            </td>

                            <td>
                                ₱{{ getItemPrice(item) }}
                            </td>

                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-dark px-3"
                                        :disabled="isUpdating || item.quantity <= 1"
                                        @click.stop.prevent="updateQuantity(getProductId(item), item.quantity - 1)"
                                    >
                                        -
                                    </button>

                                    <span class="border px-3 py-1">
                                        {{ item.quantity }}
                                    </span>

                                    <button
                                        type="button"
                                        class="btn btn-sm btn-dark px-3"
                                        :disabled="isUpdating"
                                        @click.stop.prevent="updateQuantity(getProductId(item), item.quantity + 1)"
                                    >
                                        +
                                    </button>
                                </div>
                            </td>

                            <td>
                                ₱{{ getItemSubtotal(item) }}
                            </td>

                            <td class="text-center">
                                <button
                                    type="button"
                                    class="btn btn-danger btn-sm"
                                    :disabled="isUpdating"
                                    @click.stop.prevent="removeItem(getProductId(item))"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>

                        <tr class="table-light">
                            <td colspan="3" class="text-end fw-bold">
                                Total:
                            </td>

                            <td colspan="2" class="fw-bold fs-5">
                                ₱{{ totalPrice }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="d-flex gap-2 mt-3">
                <button
                    type="button"
                    class="btn btn-success"
                    :disabled="isUpdating"
                    @click.stop.prevent="checkout"
                >
                    Checkout
                </button>

                <button
                    type="button"
                    class="btn btn-danger"
                    :disabled="isUpdating"
                    @click.stop.prevent="clearCart"
                >
                    Clear Cart
                </button>
            </div>
        </div>
    </div>
</template>