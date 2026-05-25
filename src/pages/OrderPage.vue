<script>
import { ref, computed, onBeforeMount } from 'vue';
import { Notyf } from 'notyf';
import api from '../api.js';

export default {
    setup() {
        const notyf = new Notyf();
        const orders = ref([]);
        const isLoading = ref(true);
        const activeTab = ref('active');

        const activeOrders = computed(() =>
            orders.value.filter(o => o.status === 'Pending')
        );
        const completedOrders = computed(() =>
            orders.value.filter(o => o.status === 'Completed')
        );

        async function getMyOrders() {
            isLoading.value = true;
            try {
                const { data } = await api.get('/orders/my-orders');
                orders.value = data.orders.sort((a, b) => 
                    new Date(b.orderedOn) - new Date(a.orderedOn)
                );
            } catch (e) {
                notyf.error(e.response?.data?.message || e.response?.data?.error || 'Unable to load orders.');
            } finally {
                isLoading.value = false;
            }
        }

        async function payOrder(orderId) {
            try {
                const { data } = await api.patch(`/orders/${orderId}/complete`);
                notyf.success(data.message || 'Order completed!');

                const index = orders.value.findIndex(order => order._id === orderId);
                if (index !== -1) {
                    orders.value[index] = data.order;
                }
            } catch (e) {
                notyf.error(e.response?.data?.message || e.response?.data?.error || 'Payment failed.');
            }
        }

        function formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString('en-PH', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        }

        onBeforeMount(getMyOrders);

        return { 
            activeOrders, 
            completedOrders, 
            isLoading, 
            activeTab, 
            payOrder, 
            formatDate 
        };
    }
}
</script>

<template>
    <div class="container py-5">

        <!-- Header -->
        <div class="text-center mb-5">

            <p class="orders-subtitle mb-2">
                Nectar & Nymphs
            </p>

            <h1 class="orders-title">
                My Orders
            </h1>

            <p class="orders-description mx-auto">
                Track your handcrafted pastries, café favorites, and completed purchases all in one cozy place.
            </p>
        </div>

        <!-- Loading -->
        <div
            v-if="isLoading"
            class="d-flex flex-column align-items-center justify-content-center py-5">

            <div class="spinner-border text-warning mb-3" role="status"></div>

            <p class="text-muted">
                Loading orders...
            </p>
        </div>

        <div v-else>
            <!-- Tabs -->
            <div class="d-flex justify-content-center mb-5">
                <div class="custom-tabs p-2 d-flex gap-2 flex-wrap justify-content-center">

                    <button
                        class="btn tab-btn"
                        :class="{ 'tab-btn-active': activeTab === 'active' }"
                        @click="activeTab = 'active'">

                        Active Orders

                        <span class="badge rounded-pill ms-2 bg-light text-dark">
                            {{ activeOrders.length }}
                        </span>

                    </button>

                    <button
                        class="btn tab-btn"
                        :class="{ 'tab-btn-active': activeTab === 'history' }"
                        @click="activeTab = 'history'">

                        Order History

                        <span class="badge rounded-pill ms-2 bg-light text-dark">
                            {{ completedOrders.length }}
                        </span>

                    </button>
                </div>
            </div>

            <!-- ACTIVE ORDERS -->
            <div v-if="activeTab === 'active'">

                <!-- Empty -->
                <div
                    v-if="activeOrders.length === 0"
                    class="empty-orders text-center py-5">

                    <div class="empty-icon mb-3">
                        &#128230
                    </div>

                    <h3 class="empty-title">
                        No active orders
                    </h3>

                    <p class="empty-description">
                        You don’t have any active pastry orders right now.
                    </p>

                    <router-link
                        :to="{ path: '/products' }"
                        class="btn browse-btn mt-3">

                        Browse Products

                    </router-link>
                </div>

                <!-- Orders -->
                <div
                    v-for="order in activeOrders"
                    :key="order._id"
                    class="card order-card border-0 mb-4 overflow-hidden">

                    <!-- Header -->
                    <div class="card-header order-header py-3 px-4">
                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">

                            <div>
                                <small class="text-light">
                                    Order ID
                                </small>

                                <h6 class="mb-0 fw-bold text-white">
                                    {{ order._id }}
                                </h6>

                            </div>

                            <span class="badge active-badge">
                                {{ order.status }}
                            </span>
                        </div>
                    </div>

                    <!-- Body -->
                    <div class="card-body p-4">

                        <p class="text-muted small mb-4">
                            Ordered on: {{ formatDate(order.orderedOn) }}
                        </p>

                        <div class="table-responsive">
                            <table class="table align-middle mb-0">

                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr
                                        v-for="item in order.productsOrdered"
                                        :key="item._id">

                                        <td class="fw-semibold product-name">
                                            {{ item.name }}
                                        </td>

                                        <td>
                                            {{ item.quantity }}
                                        </td>

                                        <td class="subtotal-price">
                                            ₱{{ item.subtotal }}
                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="card-footer bg-white border-0 p-4">
                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">

                            <h5 class="mb-0 total-text">
                                Total:
                                <span class="total-price">
                                    ₱{{ order.totalPrice }}
                                </span>
                            </h5>

                            <button
                                class="btn pay-btn"
                                @click="payOrder(order._id)">
                                Pay Now
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <!-- ORDER HISTORY -->
            <div v-if="activeTab === 'history'">

                <!-- Empty -->
                <div
                    v-if="completedOrders.length === 0"
                    class="empty-orders text-center py-5">

                    <div class="empty-icon mb-3">
                        ☕
                    </div>

                    <h3 class="empty-title">
                        No completed orders yet
                    </h3>

                </div>

                <!-- History Cards -->
                <div
                    v-for="order in completedOrders"
                    :key="order._id"
                    class="card order-card border-0 mb-4 overflow-hidden">

                    <!-- Header -->
                    <div class="card-header order-header py-3 px-4">

                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">

                            <div>
                                <small class="text-light-emphasis">
                                    Order ID
                                </small>
                                <h6 class="mb-0 fw-bold text-white">
                                    {{ order._id }}
                                </h6>
                            </div>

                            <span class="badge completed-badge">
                                {{ order.status }}
                            </span>
                        </div>
                    </div>

                    <!-- Body -->
                    <div class="card-body p-4">

                        <p class="text-muted small mb-4">
                            Ordered on: {{ formatDate(order.orderedOn) }}
                        </p>

                        <div class="table-responsive">

                            <table class="table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr
                                        v-for="item in order.productsOrdered"
                                        :key="item._id">

                                        <td class="fw-semibold product-name">
                                            {{ item.name }}
                                        </td>

                                        <td>
                                            {{ item.quantity }}
                                        </td>

                                        <td class="subtotal-price">
                                            ₱{{ item.subtotal }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="card-footer bg-white border-0 p-4 text-end">

                        <h5 class="mb-0 total-text">
                            
                            Total:
                            <span class="total-price">
                                ₱{{ order.totalPrice }}
                            </span>

                        </h5>

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
    .orders-subtitle {
        color: #c8a97e;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 0.8rem;
        font-weight: 700;
    }

    .orders-title {
        font-family: 'Playfair Display', serif;
        color: #2c1f14;
        font-size: 3rem;
        font-weight: 700;
    }

    .orders-description {
        max-width: 650px;
        color: #8d7661;
        line-height: 1.8;
    }

    /* Tabs */
    .custom-tabs {
        background: #f5ece0;
        border-radius: 18px;
    }

    .tab-btn {
        border-radius: 14px;
        padding: 0.8rem 1.4rem;
        font-weight: 700;
        color: #5a3e2b;
    }

    .tab-btn-active {
        background: #2c1f14;
        color: white;
    }

    /* Empty */
    .empty-orders {
        background: #fffdfb;
        border-radius: 24px;
        padding: 4rem 2rem;
        box-shadow: 0 10px 40px rgba(44,31,20,0.06);
    }

    .empty-icon {
        font-size: 4rem;
    }

    .empty-title {
        font-family: 'Playfair Display', serif;
        color: #2c1f14;
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
    }

    .browse-btn:hover {
        background: #c8a97e;
        color: #2c1f14;
    }

    /* Order Cards */
    .order-card {
        border-radius: 24px;
        background: #fffdfb;
        box-shadow: 0 15px 50px rgba(44,31,20,0.08);
    }

    .order-header {
        background:
            radial-gradient(circle at top left, rgba(200,169,126,0.15), transparent 30%),
            #2c1f14;
    }

    /* Badges */
    .active-badge {
        background: #fff3cd;
        color: #856404;
        padding: 0.7rem 1rem;
        border-radius: 999px;
    }

    .completed-badge {
        background: #d1e7dd;
        color: #0f5132;
        padding: 0.7rem 1rem;
        border-radius: 999px;
    }

    /* Table */
    .table thead th {
        background: #f5ece0;
        color: #5a3e2b;
        border: none;
        padding: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.78rem;
    }

    .table tbody td {
        padding: 1rem;
        vertical-align: middle;
    }

    .product-name {
        color: #2c1f14;
    }

    .subtotal-price {
        color: #c97d60;
        font-weight: 700;
    }

    /* Footer */
    .total-text {
        color: #5a3e2b;
    }

    .total-price {
        color: #c97d60;
        font-weight: 700;
    }

    .pay-btn {
        background: #2c1f14;
        color: white;
        border-radius: 14px;
        padding: 0.9rem 1.5rem;
        font-weight: 700;
        border: none;
    }

    .pay-btn:hover {
        background: #c8a97e;
        color: #2c1f14;
    }

    /* Responsive */
    @media (max-width: 768px) {

        .orders-title {
            font-size: 2.2rem;
        }

        .table {
            min-width: 600px;
        }
    }
</style>