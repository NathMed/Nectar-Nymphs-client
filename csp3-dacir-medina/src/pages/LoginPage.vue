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

            if(response.data) {

                notyf.success("Login Successful");

                localStorage.setItem("token", response.data.access);

                getUserDetails(response.data.access);

                email.value = "";
                password.value = "";

                router.push({path: '/product'})
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
            router.push({ path: '/product' });
        }
    });
</script>

<template>
    <div class="container-fluid">
        <h1 class="my-5 pt-3 text-primary text-center">Login Page</h1> 
        <div class="row d-flex justify-content-center">
            <div class="col-md-5 border border rounded-3 mx-auto p-5">
                <form v-on:submit="handleSubmit">
                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address</label>
                        <input 
                        type="email" 
                        class="form-control"
                        id="emailInput" 
                        placeholder="Enter your email" 
                        v-model="email" />
                    </div>
                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input 
                        type="password" 
                        class="form-control"
                        id="passwordInput" 
                        placeholder="Enter your password" 
                        v-model="password" />
                    </div>
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-primary btn-block"  v-if="isEnabled">Login</button>
                        <button type="submit" class="btn btn-danger btn-block" disabled v-else>Login</button>
                    </div>
                </form>
            </div>
            <div class="text-center mt-3">
                <p>Don't have an account yet? <router-link :to="{ path: '/register'}">Click here</router-link> to register. </p>
            </div>
        </div>
    </div>
</template>
