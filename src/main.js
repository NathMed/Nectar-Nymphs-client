// Bootstrap and Bootstrap Icons
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

import 'notyf/notyf.min.css';
import './assets/main.css'

import App from './App.vue'

// PAGES
import RegisterPage from './pages/RegisterPage.vue';
import LoginPage from './pages/LoginPage.vue';
import ProductsPage from './pages/ProductsPage.vue';
import LogoutPage from './pages/LogoutPage.vue';
import ProductDetailsPage from './pages/ProductDetailsPage.vue';
import AddProductPage from './pages/AddProductPage.vue';

// ROUTES
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/products'
        },
        {
            path: '/register',
            name: 'Register',
            component: RegisterPage
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginPage
        },
        {
            path: '/products',
            name: 'Products',
            component: ProductsPage
        },
        {
            path: '/logout',
            name: 'Logout',
            component: LogoutPage
        },
        {
            path: '/products/:id',
            component: ProductDetailsPage
        },
        {
            path: '/products/add',
            name: 'AddProduct',
            component: AddProductPage
        }
    ]
});

const app = createApp(App);

app.use(createPinia());

app.use(router);
app.mount('#app');