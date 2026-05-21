// Bootstrap and Bootstrap Icons
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

import 'notyf/notyf.min.css';

import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'

import {createPinia} from 'pinia';

// PAGES
import RegisterPage from './pages/RegisterPage.vue';
import LoginPage from './pages/LoginPage.vue';

// ROUTES
import {createRouter, createWebHistory} from 'vue-router';

const router = createRouter({
	history: createWebHistory(),

	routes: [
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
	]
})

const app = createApp(App);

app.use(createPinia());

app.use(router);
app.mount('#app');