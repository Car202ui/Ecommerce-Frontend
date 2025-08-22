// src/services/ProductService.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const API_URL = 'http://localhost:9091/api/';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});


apiClient.interceptors.request.use(config => {
    const authStore = useAuthStore();
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
});

class ProductService {
    getAllProducts() {
        return apiClient.get('products');
    }
}

export default new ProductService();