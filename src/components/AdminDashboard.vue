
<script>
    export default {
        props: {
            productData: Array,
            isLoading: Boolean
        },
        setup(props) {

            return {
                props
            }
        }
    }
</script>

<template>
    <div class="container py-5">

        <!-- Loading -->
        <div
            v-if="isLoading"
            class="d-flex flex-column align-items-center justify-content-center py-5">

            <div class="spinner-border text-warning mb-3" role="status"></div>

            <p class="text-muted mb-0">
                Loading dashboard...
            </p>

        </div>

        <!-- Dashboard -->
        <div v-else>

            <!-- Header -->
            <div class="dashboard-header text-center mb-5">

                <p class="dashboard-subtitle mb-2">
                    Nectar & Nymphs Management
                </p>

                <h1 class="dashboard-title">
                    Admin Dashboard
                </h1>

                <p class="dashboard-description mx-auto">
                    Manage your pastries, products, inventory, and customer orders from one cozy dashboard.
                </p>

            </div>

            <!-- Quick Actions -->
            <div class="d-flex flex-column flex-md-row justify-content-center gap-3 mb-5">

                <router-link
                    :to="{ path: '/products/add' }"
                    class="btn admin-btn admin-btn-primary">

                    + Add New Product

                </router-link>

                <router-link
                    :to="{ path: '/cart' }"
                    class="btn admin-btn admin-btn-success">

                    View User Orders

                </router-link>

            </div>

            <!-- Table Card -->
            <div class="card border-0 dashboard-card overflow-hidden">

                <div class="card-header dashboard-table-header py-3">

                    <h5 class="mb-0 fw-bold">
                        Product Inventory
                    </h5>

                </div>

                <div class="table-responsive">

                    <table class="table align-middle mb-0">

                        <thead>

                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th class="text-center">Update</th>
                                <th class="text-center">Availability</th>
                            </tr>

                        </thead>

                        <tbody>

                            <tr
                                v-for="product in props.productData"
                                :key="product._id">

                                <td class="fw-semibold product-name">
                                    {{ product.name }}
                                </td>

                                <td class="product-description">
                                    {{ product.description }}
                                </td>

                                <td class="fw-bold text-price">
                                    ₱{{ product.price }}
                                </td>

                                <td>

                                    <span
                                        v-if="product.isActive"
                                        class="badge status-active">

                                        Available

                                    </span>

                                    <span
                                        v-else
                                        class="badge status-inactive">

                                        Unavailable

                                    </span>

                                </td>

                                <td class="text-center">

                                    <button
                                        class="btn btn-sm update-btn">

                                        Update

                                    </button>

                                </td>

                                <td class="text-center">

                                    <button
                                        v-if="product.isActive"
                                        class="btn btn-sm disable-btn">

                                        Disable

                                    </button>

                                    <button
                                        v-else
                                        class="btn btn-sm activate-btn">

                                        Activate

                                    </button>

                                </td>

                            </tr>

                        </tbody>

                    </table>

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

.dashboard-subtitle {
    color: #c8a97e;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.8rem;
    font-weight: 700;
}

.dashboard-title {
    font-family: 'Playfair Display', serif;
    color: #2c1f14;
    font-size: 3rem;
    font-weight: 700;
}

.dashboard-description {
    max-width: 650px;
    color: #8a7561;
    line-height: 1.8;
}

.dashboard-card {
    border-radius: 24px;
    box-shadow: 0 15px 40px rgba(44,31,20,0.08);
}

.dashboard-table-header {
    background: #2c1f14;
    color: white;
}

.table thead th {
    background: #2c1f14;
    color: #f5ece0;
    font-size: 0.8rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: none;
    padding: 1rem;
}

.table tbody td {
    padding: 1rem;
    vertical-align: middle;
}

.table tbody tr:hover {
    background: #fdf8f2;
}

.product-name {
    color: #2c1f14;
}

.product-description {
    color: #7e6854;
}

.text-price {
    color: #c97d60;
}

.status-active {
    background: #d8f5df;
    color: #198754;
    padding: 0.55rem 0.9rem;
    border-radius: 999px;
}

.status-inactive {
    background: #ffe0e0;
    color: #dc3545;
    padding: 0.55rem 0.9rem;
    border-radius: 999px;
}

.admin-btn {
    padding: 0.85rem 1.4rem;
    border-radius: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    border: none;
}

.admin-btn-primary {
    background: #2c1f14;
    color: white;
}

.admin-btn-primary:hover {
    background: #c8a97e;
    color: #2c1f14;
}

.admin-btn-success {
    background: #c8a97e;
    color: #2c1f14;
}

.admin-btn-success:hover {
    background: #2c1f14;
    color: white;
}

.update-btn {
    background: #2c1f14;
    color: white;
    border-radius: 10px;
    padding-inline: 1rem;
}

.update-btn:hover {
    background: #c8a97e;
    color: #2c1f14;
}

.disable-btn {
    background: #dc3545;
    color: white;
    border-radius: 10px;
    padding-inline: 1rem;
}

.activate-btn {
    background: #198754;
    color: white;
    border-radius: 10px;
    padding-inline: 1rem;
}

@media (max-width: 768px) {

    .dashboard-title {
        font-size: 2.2rem;
    }
}
</style>
