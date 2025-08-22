// src/services/AuthService.ts

import axios from 'axios';
import type { UserLogin, UserRegister } from '@/types'; // Importamos los tipos

const API_URL = 'http://localhost:9091/api/auth/';

class AuthService {
   
    login(user: UserLogin) {
        return axios.post(API_URL + 'login', {
            username: user.username,
            password: user.password
        });
    }

   
    register(user: UserRegister) {
        return axios.post(API_URL + 'register', {
            username: user.username,
            email: user.email,
            password: user.password
        });
    }
}

export default new AuthService();