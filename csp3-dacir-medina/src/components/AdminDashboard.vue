<script>
    import ProductComponent from './ProductComponent.vue';

    export default {
        components: {
            ProductComponent
        },
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
    <div class="container">
        <h1 class="text-center mb-5">Our Products</h1>

        <div v-if="isLoading" class="text-center">
            <p>Loading products...</p>
        </div>

        <div v-else-if="props.productData.length === 0" class="text-center">
            <h4>No active products found.</h4>
        </div>
        <div class="row g-4">
            <div class="col-md-4" v-for="product in props.productData" :key="product._id">
                <ProductComponent :productData="product" />
            </div>
        </div>
    </div>
</template>