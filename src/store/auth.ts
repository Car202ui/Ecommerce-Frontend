import { defineStore } from 'pinia';
import type { LoginResponse } from '@/types'; 

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    }),
    actions: {
        login(data: LoginResponse) {
            this.token = data.accessToken;
            const userData = JSON.parse(atob(data.accessToken.split('.')[1]));

            this.user = { 
                username: userData.sub,
                roles: userData.roles || [] 
            };

            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
        },
        logout() {
            this.token = '';
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
    },
});