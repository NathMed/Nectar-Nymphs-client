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

    const user = useGlobalStore();

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
    <div class="container-fluid">
        <h1 class="my-5 pt-3 text-muted text-center">Register</h1> 
        <div class="row d-flex justify-content-center">
            <div class="col-md-5 border border rounded-3 mx-auto p-5">
                <form @submit="handleSubmit">

                    <div class="mb-3">
                        <label for="fName" class="form-label">First Name:</label>
                        <input 
                        type="text" 
                        class="form-control"
                        id="fName"
                        placeholder="Enter your First Name" 
                        v-model="firstName" />
                    </div>
                    <div class="mb-3">
                        <label for="lName" class="form-label">Last Name:</label>
                        <input 
                        type="text" 
                        class="form-control"
                        id="lName" 
                        placeholder="Enter your Last Name"
                        v-model="lastName" />
                    </div>
                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address:</label>
                        <input 
                        type="email" 
                        class="form-control"
                        id="emailInput" 
                        placeholder="Enter your email" 
                        v-model="email" />
                    </div>
                    <div class="mb-3">
                        <label for="mobile" class="form-label">Mobile Number:</label>
                        <input 
                        type="text" 
                        class="form-control"
                        id="mobile" 
                        placeholder="Enter your 11 digit mobile number"
                        v-model="mobileNo" />
                    </div>

                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password:</label>
                        <input 
                        type="password" 
                        class="form-control"
                        id="passwordInput" 
                        placeholder="Enter your password" 
                        v-model="password" />
                    </div>
                    <div class="mb-3">
                        <label for="cpasswordInput" class="form-label">Confirm Password:</label>
                        <input 
                        type="password" 
                        class="form-control"
                        id="cpasswordInput" 
                        placeholder="Verify your password"
                        v-model="confirmPassword"
                         />
                    </div>
                    <div class="d-grid mt-5">
                        <!-- Enabled submit button -->
                        <button type="submit" class="btn btn-primary btn-block" v-if="isEnabled">Submit</button>
                        <!-- Disabled submit button -->
                        <button type="submit" class="btn btn-danger btn-block" v-else disabled>Please enter your registration</button>
                    </div>
                </form>
            </div>
            <div class="text-center mt-3">
                <p>Already have an account? <router-link :to="{ path: '/login'}">Click here</router-link> to log in. </p>
            </div>
        </div>
    </div>
</template>
