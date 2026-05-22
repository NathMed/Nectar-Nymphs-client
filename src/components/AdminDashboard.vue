
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
                            <td class="fw-semibold text-dark border">{{ product.price }}</td>
                            <td class="border">
                                <span class="text-success" v-if="product.isActive">Available</span>
                                <span class="text-danger" v-else>Unavailable</span>
                            </td>
                            <td class="text-center">
                                <button class="btn btn-primary btn-sm" type="button">Update</button>
                            </td>
                            <td class="text-center">
                                <button v-if="product.isActive" class="btn btn-danger btn-sm" type="button">Disable</button>
                                <button v-else class="btn btn-success btn-sm" type="button">Activate</button>
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
