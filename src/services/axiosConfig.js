import axios from 'axios';

function getToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
}

axios.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

