import axios from 'axios';
import {API_URL} from '@/globals';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    responseType: 'json',
});

axiosInstance.interceptors.request.use((request) => {
    const token = localStorage.getItem('token');
    if (token) {
        request.headers['Authorization'] = 'Bearer ' + token;
    }
    return request;
});
