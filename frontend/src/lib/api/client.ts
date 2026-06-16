import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const auth = localStorage.getItem('agendabeleza-auth');

        if (auth) {
            const parsed = JSON.parse(auth);
            const token = parsed?.state?.token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    }

    return config;
});