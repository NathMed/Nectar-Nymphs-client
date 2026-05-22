<script>
    import { ref, watch } from "vue";
    import { useGlobalStore } from "../stores/global";


    export default {
        props: {
            productData: Object
        },
        setup({productData}) {
            const {user} = useGlobalStore();

            return {
                user
            }
        }
    }

</script>

<template>
    <div class="card product-card border-0 h-100 overflow-hidden">

        <!-- Product Image Placeholder -->
        <div class="product-image d-flex align-items-center justify-content-center">

            <span class="product-image-text">
                Nectar & Nymphs
            </span>

        </div>

        <!-- Card Body -->
        <div class="card-body d-flex flex-column p-4">

            <div class="mb-3">

                <h5 class="card-title product-title">
                    {{ productData.name }}
                </h5>

            </div>

            <p class="card-text product-description flex-grow-1">
                {{ productData.description }}
            </p>

            <div class="d-flex align-items-center justify-content-between mt-4">

                <h4 class="product-price mb-0">
                    ₱{{ productData.price }}
                </h4>

            </div>

        </div>

        <!-- Footer -->
        <div class="card-footer bg-transparent border-0 px-4 pb-4">

            <router-link
                class="btn details-btn w-100"
                type="button"
                :to="{ path: `/products/${productData._id}` }">

                View Details

            </router-link>

        </div>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Lato:wght@300;400;700&display=swap');

.product-card {
    border-radius: 22px;
    transition: all 0.3s ease;
    background: #fffdfb;
    box-shadow: 0 8px 30px rgba(44, 31, 20, 0.06);
    font-family: 'Lato', sans-serif;
}

.product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 40px rgba(44, 31, 20, 0.12);
}

.product-image {
    height: 220px;
    background:
        linear-gradient(rgba(44,31,20,0.35), rgba(44,31,20,0.35)),
        url('../assets/images/placeholder-image.jpg');
    background-size: cover;
    background-position: center;
}

.product-image-text {
    color: white;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    letter-spacing: 1px;
}

.product-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    color: #2c1f14;
    font-weight: 600;
}

.product-description {
    color: #7e6854;
    line-height: 1.7;
    font-size: 0.95rem;
}

.product-price {
    color: #c97d60;
    font-weight: 700;
}

.details-btn {
    background: #2c1f14;
    color: #fff;
    border-radius: 12px;
    padding: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    border: none;
}

.details-btn:hover {
    background: #c8a97e;
    color: #2c1f14;
}

.card-footer {
    background: transparent;
}

@media (max-width: 768px) {

    .product-image {
        height: 180px;
    }
}
</style>
