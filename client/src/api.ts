import axios from "axios";

export const BASE = "http://localhost:4002";

export const Axios = axios.create({
    baseURL: BASE,
    withCredentials: true,
});

Axios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

Axios.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err?.response?.status === 401) {
            sessionStorage.removeItem("token");

            if (window.location.pathname !== "/signin") {
                window.location.href = "/signin";
            }
        }

        return Promise.reject(err);
    }
);
