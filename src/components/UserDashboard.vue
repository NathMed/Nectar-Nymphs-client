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
    <div class="container py-5">

        <div class="text-center mb-5">

            <p class="catalog-subtitle mb-2">
                Freshly baked with love
            </p>

            <h1 class="catalog-title">
                Our Products
            </h1>

            <p class="catalog-description mx-auto">
                Discover handcrafted pastries, artisan breads, and cozy café favorites made fresh every day.
            </p>

        </div>

        <div
            v-if="isLoading"
            class="d-flex flex-column align-items-center justify-content-center py-5">

            <div class="spinner-border text-warning mb-3" role="status"></div>

            <p class="text-muted mb-0">
                Loading products...
            </p>

        </div>

        <div
            v-else-if="props.productData.length === 0"
            class="text-center py-5">

            <h4 class="empty-title">
                No active products found.
            </h4>

            <p class="text-muted">
                Please check back later for new pastries & café treats.
            </p>

        </div>

        <!-- Product Grid -->
        <div v-else class="row g-4">

            <div
                class="col-sm-6 col-lg-4"
                v-for="product in props.productData"
                :key="product._id">

                <ProductComponent :productData="product" />

            </div>

        </div>

    </div>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

    .container {
        font-family: 'Lato', sans-serif;
    }

    .catalog-subtitle {
        color: #c8a97e;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 0.8rem;
        font-weight: 700;
    }

    .catalog-title {
        font-family: 'Playfair Display', serif;
        font-size: 3rem;
        font-weight: 700;
        color: #2c1f14;
    }

    .catalog-description {
        max-width: 620px;
        color: #8d7661;
        line-height: 1.8;
    }

    .empty-title {
        color: #2c1f14;
        font-family: 'Playfair Display', serif;
    }

    @media (max-width: 768px) {

        .catalog-title {
            font-size: 2.2rem;
        }
    }
</style>