import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: process.env.API_URL || "http://api.knowledge.msharks.ru/api",
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