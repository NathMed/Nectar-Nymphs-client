import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_NECTAR_API
})

api.interceptors.request.use((config) => {

	// retrieves token from localStorage
	const token = localStorage.getItem("token");

	// Check if the token exists
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config;

})

export default api;