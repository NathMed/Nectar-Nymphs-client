import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api.js';

export const useGlobalStore = defineStore('global', () => {

	const user = reactive({
		token: localStorage.getItem('token'),
		email: null,
		isAdmin: null
	})

	async function getUserDetails(token) {
		
		if (!token) {
			localStorage.removeItem('token');
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
		user.email = data.user.email;
		user.isAdmin = data.user.isAdmin;
	}

	return {
		user,
		getUserDetails
	}
})