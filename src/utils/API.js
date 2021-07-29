import axios from 'axios';
import Cookies from 'js-cookie';
import {API_URL} from '@/globals';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    responseType: 'json',
});

axiosInstance.interceptors.request.use((request) => {
    const token = Cookies.get('token');
    if (token) {
        request.headers['Authorization'] = 'Bearer ' + token;
    }
    return request;
});
