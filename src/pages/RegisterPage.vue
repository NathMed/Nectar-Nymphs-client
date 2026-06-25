<script setup>
	import {watch, ref, onBeforeMount} from 'vue';
	import { Notyf } from 'notyf';

	import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global.js';

    import api from '../api.js'

    const firstName = ref("");
    const lastName = ref("");
    const mobileNo = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    // for button
    const isEnabled = ref(false);

    const notyf = new Notyf();

    const router = useRouter()

    watch([firstName, lastName, mobileNo, email, password, confirmPassword], (currentValue, oldValue) => {

    	// check if everything have value and password and confirm pass is match
    	if (currentValue.every(input => input !== "") && currentValue[4] === currentValue[5]) {
    		// allow submit
    		isEnabled.value = true;
    	} else {
    		isEnabled.value = false;
    	}
    })

    async function handleSubmit(e) {
    	e.preventDefault();

    	try {
    		let response = await api.post('users/register', {
    			firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                mobileNo: mobileNo.value,
                password: password.value
    		})

    		if (response.status === 201) {
    			notyf.success(response.data.message);

    			firstName.value = "";
                lastName.value = "";
                mobileNo.value = "";
                email.value = "";
                password.value = "";
                confirmPassword.value = "";

                router.push({path: '/login'}) 
    		} else {

    			notyf.error("Registration Failed. Please contact administrator.");
    		}
    	} catch (e) {

    		if (e.response.status === 404 || e.response.status === 401 || e.response.status === 400 || e.response.status === 409) {

    			notyf.error(e.response.data.error);
    		} else {

    			notyf.error("Registration Failed. Please contact administrator.")
    		}
    	}
    }

    onBeforeMount(() => {

        if(localStorage.getItem("token")){
            router.push({path: '/login'})
        }
    })


</script>

<template>
    <div class="container-fluid register-page min-vh-100">
        <div class="row min-vh-100">

            <!-- Left Brand Panel -->
            <div class="col-lg-5 brand-panel d-flex align-items-center justify-content-center">

                <div class="brand-panel__inner text-center text-lg-start">

                    <h1 class="brand-name">
                        Nectar<span>&</span>Nymphs
                    </h1>

                    <p class="brand-tagline">
                        Handcrafted pastries & artisan coffee, delivered with love.
                    </p>

                    <div class="brand-divider"></div>

                    <ul class="brand-perks list-unstyled d-flex flex-column gap-3">
                        <li>&#129360 Fresh baked goods, daily</li>
                        <li>&#9749 Single-origin coffees</li>
                        <li>&#128722 Premium baking ingredients</li>
                        <li>&#128230 Free delivery on ₱999+</li>
                    </ul>

                </div>

            </div>

            <!-- Right Form Panel -->
            <div class="col-lg-7 d-flex align-items-center justify-content-center p-4">

                <div class="form-wrapper w-100">

                    <div class="mb-4">
                        <h2 class="form-title">Create Account</h2>

                        <p class="form-subtitle">
                            Join our community of home bakers & coffee lovers.
                        </p>
                    </div>

                    <form @submit="handleSubmit" class="d-flex flex-column gap-3" novalidate>

                        <div class="row g-3">

                            <div class="col-md-6">
                                <label for="fName" class="form-label custom-label">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    id="fName"
                                    class="form-control custom-input"
                                    placeholder="Juan"
                                    v-model="firstName" />
                            </div>

                            <div class="col-md-6">
                                <label for="lName" class="form-label custom-label">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    id="lName"
                                    class="form-control custom-input"
                                    placeholder="dela Cruz"
                                    v-model="lastName" />
                            </div>

                        </div>

                        <div>
                            <label for="emailInput" class="form-label custom-label">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="emailInput"
                                class="form-control custom-input"
                                placeholder="juan@email.com"
                                v-model="email" />
                        </div>

                        <div>
                            <label for="mobile" class="form-label custom-label">
                                Mobile Number
                            </label>

                            <input
                                type="text"
                                id="mobile"
                                class="form-control custom-input"
                                placeholder="09XXXXXXXXX"
                                maxlength="11"
                                v-model="mobileNo" />
                        </div>

                        <div>
                            <label for="passwordInput" class="form-label custom-label">
                                Password
                            </label>

                            <input
                                type="password"
                                id="passwordInput"
                                class="form-control custom-input"
                                placeholder="Minimum 8 characters"
                                v-model="password" />
                        </div>

                        <div>
                            <label for="cpasswordInput" class="form-label custom-label">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                id="cpasswordInput"
                                class="form-control custom-input"
                                placeholder="Re-enter your password"
                                v-model="confirmPassword" />
                        </div>

                        <button
                            type="submit"
                            class="btn submit-btn w-100"
                            :class="{ 'submit-btn--active': isEnabled }"
                            :disabled="!isEnabled">

                            {{ isEnabled ? 'Create My Account' : 'Fill in all fields to continue' }}

                        </button>

                    </form>

                    <p class="register-link text-center mt-4">
                        Already have an account?

                        <router-link :to="{ path: '/login' }">
                            Sign in
                        </router-link>
                    </p>

                </div>

            </div>

        </div>
    </div>
</template>

<style scoped>

    .register-page {
        background: #fdf8f2;
        font-family: 'Lato', sans-serif;
    }

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

    .form-wrapper {
        max-width: 460px;
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
        color: white;
    }

    .submit-btn--active:hover {
        background: #c8a97e;
        color: #2c1f14;
    }

    .register-link {
        color: #9c836b;
    }

    .register-link a {
        color: #c8a97e;
        font-weight: 700;
        text-decoration: none;
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