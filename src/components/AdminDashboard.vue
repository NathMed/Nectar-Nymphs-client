
<script>
    import { ref, reactive } from 'vue';
    import { Notyf } from 'notyf';
    import api from '../api.js';

    export default {
        props: {
            productData: Array,
            isLoading: Boolean
        },
        emits: ['refreshProducts'],
        setup(props, { emit }) {
            const notyf = new Notyf();
            const isUpdating = ref(false);
            const selectedProductId = ref(null);
            const actionLoadingId = ref(null);
            const updateForm = reactive({
                name: '',
                description: '',
                price: ''
            });

            function setUpdateForm(product) {
                selectedProductId.value = product._id;
                updateForm.name = product.name;
                updateForm.description = product.description;
                updateForm.price = product.price;
                isUpdating.value = true;

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            function cancelUpdate() {
                selectedProductId.value = null;
                updateForm.name = '';
                updateForm.description = '';
                updateForm.price = '';
                isUpdating.value = false;
            }

            async function updateProduct() {
                if (!updateForm.name || !updateForm.description || !updateForm.price) {
                    notyf.error('Please complete all product fields.');
                    return;
                }

                try {
                    const { data } = await api.patch(`/products/${selectedProductId.value}/update`, {
                        name: updateForm.name,
                        description: updateForm.description,
                        price: Number(updateForm.price)
                    });

                    notyf.success(data.message);
                    cancelUpdate();
                    emit('refreshProducts');
                } catch (error) {
                    notyf.error(error.response?.data?.message || error.response?.data?.error || 'Unable to update product.');
                }
            }

            async function deactivateProduct(productId) {
                actionLoadingId.value = productId;

                try {
                    const { data } = await api.patch(`/products/${productId}/archive`);
                    notyf.success(data.message);
                    emit('refreshProducts');
                } catch (error) {
                    notyf.error(error.response?.data?.message || error.response?.data?.error || 'Unable to disable product.');
                } finally {
                    actionLoadingId.value = null;
                }
            }

            async function activateProduct(productId) {
                actionLoadingId.value = productId;

                try {
                    const { data } = await api.patch(`/products/${productId}/activate`);
                    notyf.success(data.message);
                    emit('refreshProducts');
                } catch (error) {
                    notyf.error(error.response?.data?.message || error.response?.data?.error || 'Unable to activate product.');
                } finally {
                    actionLoadingId.value = null;
                }
            }

            return {
                props,
                isUpdating,
                actionLoadingId,
                updateForm,
                setUpdateForm,
                cancelUpdate,
                updateProduct,
                deactivateProduct,
                activateProduct
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

            <!-- Update Product Information -->
            <div
                v-if="isUpdating"
                class="row justify-content-center mb-5">

                <div class="col-lg-8">

                    <div class="card update-card border-0 overflow-hidden">

                        <!-- Header -->
                        <div class="card-header update-header py-4 text-center">

                            <p class="update-subtitle mb-2">
                                Product Management
                            </p>

                            <h3 class="update-title mb-0">
                                Update Product Information
                            </h3>

                        </div>

                        <!-- Form -->
                        <div class="card-body p-4 p-lg-5">

                            <form
                                @submit.prevent="updateProduct"
                                class="d-flex flex-column gap-4">

                                <!-- Product Name -->
                                <div>

                                    <label
                                        for="updateName"
                                        class="form-label custom-label">

                                        Product Name

                                    </label>

                                    <input
                                        id="updateName"
                                        type="text"
                                        class="form-control custom-input"
                                        placeholder="Enter updated product name"
                                        v-model="updateForm.name">

                                </div>

                                <!-- Description -->
                                <div>

                                    <label
                                        for="updateDescription"
                                        class="form-label custom-label">

                                        Description

                                    </label>

                                    <textarea
                                        id="updateDescription"
                                        class="form-control custom-input custom-textarea"
                                        rows="5"
                                        placeholder="Update product description"
                                        v-model="updateForm.description">

                                    </textarea>

                                </div>

                                <!-- Price -->
                                <div>

                                    <label
                                        for="updatePrice"
                                        class="form-label custom-label">

                                        Price

                                    </label>

                                    <div class="input-group">

                                        <span class="input-group-text peso-sign">
                                            ₱
                                        </span>

                                        <input
                                            id="updatePrice"
                                            type="number"
                                            min="1"
                                            class="form-control custom-input"
                                            placeholder="0.00"
                                            v-model="updateForm.price">

                                    </div>

                                </div>

                                <!-- Buttons -->
                                <div class="d-flex flex-column flex-sm-row gap-3 pt-2">

                                    <button
                                        type="submit"
                                        class="btn flex-grow-1 update-btn">

                                        Save Changes

                                    </button>

                                    <button
                                        type="button"
                                        class="btn flex-grow-1 cancel-btn"
                                        @click="cancelUpdate">

                                        Cancel

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

            <!-- Quick Actions -->
            <div class="d-flex flex-column flex-md-row justify-content-center gap-3 mb-5">

                <router-link
                    :to="{ path: '/products/add' }"
                    class="btn admin-btn admin-btn-primary">
                    + Add New Product
                </router-link>

                <router-link
                    :to="{ path: '/orders' }"
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
                                        class="btn btn-sm update-btn"
                                        type="button"
                                        @click.stop.prevent="setUpdateForm(product)">
                                        Update
                                    </button>
                                </td>

                                <td class="text-center">

                                    <button
                                        v-if="product.isActive"
                                        class="btn btn-sm disable-btn"
                                        type="button"
                                        :disabled="actionLoadingId === product._id"
                                        @click.stop.prevent="deactivateProduct(product._id)">
                                        {{ actionLoadingId === product._id ? 'Disabling...' : 'Disable' }}
                                    </button>

                                    <button
                                        v-else
                                        class="btn btn-sm activate-btn"
                                        type="button"
                                        :disabled="actionLoadingId === product._id"
                                        @click.stop.prevent="activateProduct(product._id)">
                                        {{ actionLoadingId === product._id ? 'Activating...' : 'Activate' }}
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

.update-card {
    border-radius: 24px;
    background: #fffdfb;
    box-shadow: 0 15px 50px rgba(44,31,20,0.08);
    font-family: 'Lato', sans-serif;
}

.update-header {
    background:
        radial-gradient(circle at top left, rgba(200,169,126,0.15), transparent 30%),
        #2c1f14;
    color: white;
}

.update-subtitle {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.75rem;
    color: #c8a97e;
    font-weight: 700;
}

.update-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
}

.update-btn,
.cancel-btn {
    border-radius: 14px;
    padding: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    border: none;
    transition: all 0.2s ease;
}

.cancel-btn {
    background: #e9dfd4;
    color: #5a3e2b;
}

.cancel-btn:hover {
    background: #d7c3ad;
    color: #2c1f14;
}

.custom-input {
    border-radius: 12px;
    border: 1.5px solid #e6d9cc;
    padding: 0.85rem 1rem;
    transition: all 0.2s ease;
}

.custom-input:focus {
    border-color: #c8a97e;
    box-shadow: 0 0 0 0.25rem rgba(200,169,126,0.15);
}

.custom-textarea {
    resize: none;
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

.peso-sign {
    background: #f5ece0;
    border: 1.5px solid #e6d9cc;
    color: #7a5d45;
    font-weight: 700;
    border-radius: 12px 0 0 12px;
}

@media (max-width: 768px) {
    .update-title {
        font-size: 1.7rem;
    }
    
    .dashboard-title {
        font-size: 2.2rem;
    }
}



</style>
