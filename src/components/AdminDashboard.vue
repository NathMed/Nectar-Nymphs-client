
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
                    await api.patch(`/products/${selectedProductId.value}/update`, {
                        name: updateForm.name,
                        description: updateForm.description,
                        price: Number(updateForm.price)
                    });

                    notyf.success('Product updated successfully.');
                    cancelUpdate();
                    emit('refreshProducts');
                } catch (error) {
                    notyf.error(error.response?.data?.message || error.response?.data?.error || 'Unable to update product.');
                }
            }

            async function deactivateProduct(productId) {
                try {
                    await api.patch(`/products/${productId}/archive`);
                    notyf.success('Product disabled successfully.');
                    emit('refreshProducts');
                } catch (error) {
                    notyf.error(error.response?.data?.message || error.response?.data?.error || 'Unable to disable product.');
                }
            }

            async function activateProduct(productId) {
                try {
                    await api.patch(`/products/${productId}/activate`);
                    notyf.success('Product activated successfully.');
                    emit('refreshProducts');
                } catch (error) {
                    notyf.error(error.response?.data?.message || error.response?.data?.error || 'Unable to activate product.');
                }
            }

            return {
                props,
                isUpdating,
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
    <div
        v-if="isLoading"
        class="d-flex flex-column align-items-center justify-content-center py-5">

        <div class="spinner-border text-warning mb-3" role="status"></div>

        <p class="text-muted mb-0">
            Loading products...
        </p>

    </div>
    <div class="row mt-3">
        <div class="col-12">
            <h2 class="text-center text-muted">Admin Dashboard</h2>
            <div class="text-center mb-4">
                <router-link :to="{ path: '/products/add' }" class="mx-1 p-2 px-3 bg-primary text-light border-0 text-decoration-none">Add New Product</router-link>
                <router-link :to="{ path: '/cart' }" class="mx-1 p-2 px-3 bg-success text-light border-0 text-decoration-none">Show User Order</router-link>
            </div>

            <!-- Update Product Information -->
            <div v-if="isUpdating" class="card shadow-sm border mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Update Product Information</h5>
                </div>

                <div class="card-body">
                    <form @submit.prevent="updateProduct">
                        <div class="mb-3">
                            <label for="updateName" class="form-label">Product Name:</label>
                            <input id="updateName" type="text" class="form-control" v-model="updateForm.name">
                        </div>

                        <div class="mb-3">
                            <label for="updateDescription" class="form-label">Description:</label>
                            <textarea id="updateDescription" class="form-control" rows="4" v-model="updateForm.description"></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="updatePrice" class="form-label">Price:</label>
                            <input id="updatePrice" type="number" min="1" class="form-control" v-model="updateForm.price">
                        </div>

                        <button type="submit" class="btn btn-primary me-2">Update</button>
                        <button type="button" class="btn btn-secondary" @click="cancelUpdate">Cancel</button>
                    </form>
                </div>
            </div>
            
            <div class="table-responsive shadow-sm border bg-white">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-dark text-uppercase fs-7">
                        <tr>
                            <th scope="col" class="border">Name</th>
                            <th scope="col" class="border">Description</th>
                            <th scope="col" class="border">Price</th>
                            <th scope="col" class="border">Availability</th>
                            <th scope="col" colspan="2" class="text-center border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in props.productData" :key="product._id">
                            <td class="text-primary border">{{ product.name }}</td>
                            <td class="border">{{ product.description }}</td>
                            <td class="fw-semibold text-dark border">₱{{ product.price }}</td>
                            <td class="border">
                                <span class="text-success" v-if="product.isActive">Available</span>
                                <span class="text-danger" v-else>Unavailable</span>
                            </td>
                            <td class="text-center">
                                <button class="btn btn-primary btn-sm" type="button">Update</button>
                            </td>
                            <td class="text-center">
                                <button v-if="product.isActive" class="btn btn-danger btn-sm" type="button" @click="deactivateProduct(product._id)">Disable</button>
                                <button v-else class="btn btn-success btn-sm" type="button" @click="activateProduct(product._id)">Activate</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>

    .fs-7 { font-size: 0.8rem; }
</style>
