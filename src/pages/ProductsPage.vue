<script>
    import { watch, ref, reactive, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    import api from '../api.js';

    import UserDashboard from '../components/UserDashboard.vue';
    import AdminDashboard from '../components/AdminDashboard.vue';

    import { useGlobalStore } from '../stores/global.js'; 

    export default {
        components: {
            AdminDashboard,
            UserDashboard
        },
        setup() {
            const store = useGlobalStore();
            const products = reactive({ data: [] });
            const isLoading = ref(true);

            async function fetchProducts() {
                isLoading.value = true;

                try {
                    if (store.user.isAdmin) {
                        let { data } = await api.get('/products/all');
                        products.data = Array.isArray(data) ? data : [];
                    } else {
                        let { data } = await api.get('/products/active');
                        products.data = Array.isArray(data) ? data : [];
                    }
                } catch (e) {
                    console.error('Error fetching products:', e);
                    products.data = [];
                } finally {
                    isLoading.value = false;
                }
            }

            watch(
                () => store.user.isAdmin,
                async (isAdmin) => {
                    isLoading.value = true;
                    try {
                        if (isAdmin) {
                            let { data } = await api.get('/products/all');
                            products.data = Array.isArray(data) ? data : [];
                        } else {
                            let { data } = await api.get('/products/active');
                            products.data = Array.isArray(data) ? data : [];
                        }
                    } catch (e) {
                        console.error("Error fetching products:", e);
                    } finally {
                        isLoading.value = false;
                    }
                },

                { immediate: true }
            );

            return {
                products,
                user: store.user,
                isLoading,
                fetchProducts
            }
        }
    }
        



</script>

<template>
    <div class="container">
        <AdminDashboard 
            v-if="user.isAdmin" 
            :productData="products.data"
            :isLoading="isLoading"
            @refresh-products="fetchProducts"
        />

        <UserDashboard 
            v-else 
            :productData="products.data"
            :isLoading="isLoading" 
        />
    </div>
</template>
