import axios from "axios";
import storage from "utils/storage";

const api = axios.create({
    baseURL: "https://api.github.com"
});

api.interceptors.request.use((config) => {
    let token = storage.getToken();
    if (!token) {
        token = process.env.REACT_APP_BITLY_ACCESS_TOKEN;
    }
    const headers = { ...config.headers };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return { ...config, headers };
});

export default api;
