import {defineStore} from 'pinia';

import {reactive} from 'vue';

import axios from 'axios';


export const useGlobalStore = defineStore('global', () => {

	let user = reactive({
		token: localStorage.getItem('token'),
		email: null,
		isAdmin: null
	})

	async function getUserDetails(token) {
		
		if (!token) {
			user.token = null;
			user.email = null;
			user.isAdmin = null;

			return;
		}

		let {data} = await axios.get(`${import.meta.env.VITE_NECTAR_API}/users/details`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})

		
		user.token = token;
		user.email = data.email;
		user.isAdmin = data.isAdmin;
	}

	return {
		getUserDetails
	}
})