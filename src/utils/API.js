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


axiosInstance.interceptors.response.use((response) => {
    if (response.status == '401') {
        window.location.replace('/auth')
    }

    return response;
});