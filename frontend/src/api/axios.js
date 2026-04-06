import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // L'adresse du Laravel de ton ami
    withCredentials: true,                // Permet de gérer les cookies de session (Sanctum)
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

export default api;