import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

//  request interceptor
axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers!.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//  response interceptor
axios.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response;
        } else if (response.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/smk-admin';
        }
    },
    (error) => {
        if (error.response) {
            console.error('Response Error Status:', error.response.status);
            console.error('Response Error Data:', error.response.data);
        } else if (error.request) {
            console.error('Request Error:', error.request);
        } else {
            console.error('General Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axios;
