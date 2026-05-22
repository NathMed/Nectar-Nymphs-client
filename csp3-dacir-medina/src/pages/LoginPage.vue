<script setup>
    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';

    import axios from 'axios';

    import {useRouter} from 'vue-router';

    import {useGlobalStore} from '../stores/global';

    import api from '../api.js';

    const store = useGlobalStore();
    const getUserDetails = store.getUserDetails;

    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const isEnabled = ref(false);

    const notyf = new Notyf();

    watch([email,password], (currentValue, oldValue) => {

        if(currentValue.every(input => input !== "")){
            isEnabled.value = true
        } else {
            isEnabled.value = false
        }
    });

    async function handleSubmit(e){
        e.preventDefault();

        try {

            let response = await api.post(`/users/login`, {
                email: email.value,
                password: password.value

            })
            console.log(email)
            if(response.data) {

                notyf.success("Login Successful");

                localStorage.setItem("token", response.data.access);

                getUserDetails(response.data.access);

                email.value = "";
                password.value = "";

                router.push({path: '/products'})
            } else {

                notyf.error("Login Failed. Please contact administrator.");
            }
        } catch (e) {
            if(e.response.status === 404 || e.response.status === 401 || e.response.status === 400) {

                notyf.error(e.response.data.error);
            } else {
                notyf.error("Login Failed. Please contact administrator.")
            }

        }
    }

    onBeforeMount(() => {
        if (localStorage.getItem("token")) {
            router.push({ path: '/products' });
        }
    });
</script>

<template>
    <div class="container-fluid login-page min-vh-100">
        <div class="row min-vh-100">

            <!-- Left Brand Panel -->
            <div class="col-lg-5 brand-panel d-flex align-items-center justify-content-center">

                <div class="brand-panel__inner text-center text-lg-start">
                    <h1 class="brand-name">
                        Nectar<span>&</span>Nymphs
                    </h1>

                    <p class="brand-tagline">
                        Welcome back to your cozy pastry & coffee haven.
                    </p>

                    <div class="brand-divider"></div>

                    <ul class="brand-perks list-unstyled d-flex flex-column gap-3">
                        <li>&#129360 Fresh baked goods, daily</li>
                        <li>&#9749 Single-origin coffees</li>
                        <li>&#127856 Exclusive seasonal pastries</li>
                        <li>&#128230 Fast & reliable delivery</li>
                    </ul>
                </div>

            </div>

            <!-- Right Form Panel -->
            <div class="col-lg-7 d-flex align-items-center justify-content-center p-4">

                <div class="form-wrapper w-100">

                    <div class="mb-4">
                        <h2 class="form-title">Welcome Back</h2>
                        <p class="form-subtitle">
                            Login to continue your pastry experience.
                        </p>
                    </div>

                    <form v-on:submit="handleSubmit" class="d-flex flex-column gap-3">

                        <div>
                            <label for="emailInput" class="form-label custom-label">
                                Email Address
                            </label>

                            <input
                                type="email"
                                class="form-control custom-input"
                                id="emailInput"
                                placeholder="juan@email.com"
                                v-model="email" />
                        </div>

                        <div>
                            <label for="passwordInput" class="form-label custom-label">
                                Password
                            </label>

                            <input
                                type="password"
                                class="form-control custom-input"
                                id="passwordInput"
                                placeholder="Enter your password"
                                v-model="password" />
                        </div>

                        <button
                            type="submit"
                            class="btn submit-btn w-100"
                            :class="{ 'submit-btn--active': isEnabled }"
                            :disabled="!isEnabled">

                            {{ isEnabled ? 'Login to My Account' : 'Enter your credentials' }}

                        </button>

                    </form>

                    <p class="register-link text-center mt-4">
                        Don’t have an account?

                        <router-link :to="{ path: '/register'}">
                            Create one
                        </router-link>
                    </p>

                </div>

            </div>

        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Lato:wght@300;400;700&display=swap');

.login-page {
    background: #fdf8f2;
    font-family: 'Lato', sans-serif;
}

/* Brand Panel */
.brand-panel {
    background:
        radial-gradient(ellipse at 20% 80%, rgba(200,169,126,0.15) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(200,169,126,0.1) 0%, transparent 50%),
        #2c1f14;
    padding: 3rem;
}

.brand-panel__inner {
    max-width: 340px;
}

.brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    color: #f5ece0;
    font-weight: 600;
}

.brand-name span {
    color: #c8a97e;
    font-style: italic;
}

.brand-tagline {
    color: #b79d84;
    line-height: 1.7;
    margin-top: 1rem;
}

.brand-divider {
    width: 50px;
    height: 1px;
    background: #c8a97e;
    margin: 2rem 0;
}

.brand-perks li {
    color: #ceb8a2;
    font-size: 0.95rem;
}

/* Form */
.form-wrapper {
    max-width: 430px;
}

.form-title {
    font-family: 'Playfair Display', serif;
    color: #2c1f14;
    font-size: 2rem;
    font-weight: 600;
}

.form-subtitle {
    color: #9c836b;
}

.custom-label {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #5a3e2b;
}

.custom-input {
    height: 48px;
    border-radius: 10px;
    border: 1.5px solid #e6d9cc;
}

.custom-input:focus {
    border-color: #c8a97e;
    box-shadow: 0 0 0 0.25rem rgba(200,169,126,0.15);
}

/* Button */
.submit-btn {
    height: 50px;
    border-radius: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: #e6d9cc;
    color: #a8917a;
    border: none;
}

.submit-btn--active {
    background: #2c1f14;
    color: #fff;
}

.submit-btn--active:hover {
    background: #c8a97e;
    color: #2c1f14;
}

/* Link */
.register-link {
    color: #9c836b;
}

.register-link a {
    color: #c8a97e;
    text-decoration: none;
    font-weight: 700;
}

.register-link a:hover {
    text-decoration: underline;
}

@media (max-width: 991px) {
    .brand-panel {
        min-height: 320px;
    }

    .brand-divider {
        margin-inline: auto;
    }
}
</style>