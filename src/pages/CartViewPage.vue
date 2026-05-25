<script>
import { ref, computed, onBeforeMount } from 'vue';
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
                router.push({ path: '/orders' });
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
    <div class="container py-5">

        <!-- Header -->
        <div class="text-center mb-5">
            <p class="cart-subtitle mb-2">
                Nectar & Nymphs
            </p>

            <h1 class="cart-title">
                Your Shopping Cart
            </h1>

            <p class="cart-description mx-auto">
                Review your handcrafted pastries, artisan coffee, and café favorites before checkout.
            </p>
        </div>

        <!-- Loading -->
        <div
            v-if="isLoading"
            class="d-flex flex-column align-items-center justify-content-center py-5">

            <div class="spinner-border text-warning mb-3" role="status"></div>

            <p class="text-muted mb-0">
                Loading cart...
            </p>
        </div>

        <!-- Empty Cart -->
        <div
            v-else-if="getCartItems().length === 0"
            class="empty-cart text-center py-5">

            <div class="empty-icon mb-3">
                🛒
            </div>

            <h3 class="empty-title">
                Your cart is empty
            </h3>

            <p class="empty-description">
                Looks like you haven’t added any delicious treats yet.
            </p>

            <router-link
                :to="{ path: '/products' }"
                class="btn browse-btn mt-3">
                Browse Products
            </router-link>
        </div>

        <!-- Cart Content -->
        <div v-else class="row justify-content-center">
            <div class="col-xl-10">
                <div class="card cart-card border-0 overflow-hidden">

                    <!-- Card Header -->
                    <div class="card-header cart-header py-4 px-4">
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">

                            <div>
                                <h4 class="fw-bold mb-1">
                                    Cart Items
                                </h4>
                                <small class="text-light">
                                    {{ getCartItems().length }} item(s) in your cart
                                </small>
                            </div>

                            <span class="cart-badge">
                                Freshly Prepared
                            </span>
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th class="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr
                                    v-for="item in getCartItems()"
                                    :key="getProductId(item)">

                                    <!-- Product -->
                                    <td>

                                        <div class="d-flex align-items-center gap-3">

                                            <div class="product-placeholder">
                                                ☕
                                            </div>

                                            <div>

                                                <h6 class="product-name mb-1">
                                                    {{ getItemName(item) }}
                                                </h6>

                                                <small class="text-muted">
                                                    Freshly prepared
                                                </small>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Price -->
                                    <td class="price-text">
                                        ₱{{ getItemPrice(item) }}
                                    </td>

                                    <!-- Quantity -->
                                    <td>

                                        <div class="d-flex align-items-center gap-2">

                                            <button
                                                type="button"
                                                class="btn quantity-btn"
                                                :disabled="isUpdating || item.quantity <= 1"
                                                @click.stop.prevent="updateQuantity(getProductId(item), item.quantity - 1)">
                                                −
                                            </button>

                                            <span class="quantity-display">
                                                {{ item.quantity }}
                                            </span>

                                            <button
                                                type="button"
                                                class="btn quantity-btn"
                                                :disabled="isUpdating"
                                                @click.stop.prevent="updateQuantity(getProductId(item), item.quantity + 1)">
                                                +
                                            </button>
                                        </div>
                                    </td>

                                    <!-- Subtotal -->
                                    <td class="subtotal-text">
                                        ₱{{ getItemSubtotal(item) }}
                                    </td>

                                    <!-- Remove -->
                                    <td class="text-center">
                                        <button
                                            type="button"
                                            class="btn remove-btn"
                                            :disabled="isUpdating"
                                            @click.stop.prevent="removeItem(getProductId(item))">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Footer -->
                    <div class="card-footer bg-white border-0 p-4">

                        <div class="row g-4 align-items-center">

                            <!-- Total -->
                            <div class="col-lg-6">

                                <div class="total-box">

                                    <p class="mb-1 total-label">
                                        Total Amount
                                    </p>

                                    <h2 class="total-price mb-0">
                                        ₱{{ totalPrice }}
                                    </h2>

                                </div>

                            </div>

                            <!-- Actions -->
                            <div class="col-lg-6">

                                <div class="d-flex flex-column flex-sm-row gap-3 justify-content-lg-end">

                                    <button
                                        type="button"
                                        class="btn checkout-btn"
                                        :disabled="isUpdating"
                                        @click.stop.prevent="checkout">
                                        Checkout
                                    </button>

                                    <button
                                        type="button"
                                        class="btn clear-btn"
                                        :disabled="isUpdating"
                                        @click.stop.prevent="clearCart">
                                        Clear Cart
                                    </button>
                                </div>
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

    .container {
        font-family: 'Lato', sans-serif;
    }

    /* Header */
    .cart-subtitle {
        color: #c8a97e;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 0.8rem;
        font-weight: 700;
    }

    .cart-title {
        font-family: 'Playfair Display', serif;
        font-size: 3rem;
        font-weight: 700;
        color: #2c1f14;
    }

    .cart-description {
        max-width: 650px;
        color: #8d7661;
        line-height: 1.8;
    }

    /* Empty */
    .empty-cart {
        background: #fffdfb;
        border-radius: 28px;
        padding: 4rem 2rem;
        box-shadow: 0 10px 40px rgba(44,31,20,0.06);
    }

    .empty-icon {
        font-size: 4rem;
    }

    .empty-title {
        font-family: 'Playfair Display', serif;
        color: #2c1f14;
        font-size: 2rem;
    }

    .empty-description {
        color: #8d7661;
    }

    .browse-btn {
        background: #2c1f14;
        color: white;
        border-radius: 14px;
        padding: 0.9rem 1.5rem;
        font-weight: 700;
        border: none;
    }

    .browse-btn:hover {
        background: #c8a97e;
        color: #2c1f14;
    }

    /* Card */
    .cart-card {
        border-radius: 28px;
        background: #fffdfb;
        box-shadow: 0 15px 50px rgba(44,31,20,0.08);
    }

    .cart-header {
        background:
            radial-gradient(circle at top left, rgba(200,169,126,0.15), transparent 30%),
            #2c1f14;
        color: white;
    }

    .cart-badge {
        background: rgba(255,255,255,0.15);
        padding: 0.7rem 1rem;
        border-radius: 999px;
        font-size: 0.8rem;
        backdrop-filter: blur(10px);
    }

    /* Table */
    .table thead th {
        background: #2c1f14;
        color: #f5ece0;
        border: none;
        padding: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.78rem;
    }

    .table tbody td {
        padding: 1.25rem 1rem;
        vertical-align: middle;
    }

    .table tbody tr:hover {
        background: #fdf8f2;
    }

    /* Product */
    .product-placeholder {
        width: 58px;
        height: 58px;
        border-radius: 16px;
        background: #f5ece0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }

    .product-name {
        color: #2c1f14;
        font-weight: 700;
    }

    /* Price */
    .price-text {
        color: #5a3e2b;
        font-weight: 600;
    }

    .subtotal-text {
        color: #c97d60;
        font-weight: 700;
    }

    /* Quantity */
    .quantity-btn {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        border: 1px solid #e6d9cc;
        background: white;
        font-size: 1.2rem;
        font-weight: 700;
        transition: all 0.2s ease;
    }

    .quantity-btn:hover {
        background: #2c1f14;
        color: white;
    }

    .quantity-display {
        min-width: 60px;
        text-align: center;
        border: 1px solid #e6d9cc;
        border-radius: 12px;
        padding: 0.55rem 1rem;
        font-weight: 700;
        color: #5a3e2b;
    }

    /* Buttons */
    .remove-btn {
        background: #dc3545;
        color: white;
        border-radius: 12px;
        padding: 0.65rem 1rem;
        font-weight: 700;
        border: none;
    }

    .remove-btn:hover {
        background: #bb2d3b;
    }

    .checkout-btn {
        background: #2c1f14;
        color: white;
        border-radius: 14px;
        padding: 0.9rem 1.5rem;
        font-weight: 700;
        border: none;
    }

    .checkout-btn:hover {
        background: #c8a97e;
        color: #2c1f14;
    }

    .clear-btn {
        background: #e9dfd4;
        color: #5a3e2b;
        border-radius: 14px;
        padding: 0.9rem 1.5rem;
        font-weight: 700;
        border: none;
    }

    .clear-btn:hover {
        background: #d7c3ad;
        color: #2c1f14;
    }

    /* Total */
    .total-box {
        background: #f9f3ed;
        border-radius: 18px;
        padding: 1.5rem;
    }

    .total-label {
        color: #8d7661;
    }

    .total-price {
        color: #c97d60;
        font-weight: 700;
        font-family: 'Playfair Display', serif;
    }

    /* Responsive */
    @media (max-width: 768px) {

        .cart-title {
            font-size: 2.2rem;
        }

        .table {
            min-width: 750px;
        }
    }
</style>