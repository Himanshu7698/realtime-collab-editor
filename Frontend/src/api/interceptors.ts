import axios from "axios";

const getToken = () => localStorage.getItem("token");

const onRequest = (config: any) => {
    const token = getToken();
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
};

const onRequestError = (error: any) => {
    return Promise.reject(error);
};

const onResponse = (response: any) => response;

const onResponseError = async (error: any) => {
    if (error.response) {
        if (error.response.data.message === 'jwt expired' || error.response.data.message === 'jwt expired') {
            const notProtectedRoute: string[] = [];
            if (!notProtectedRoute.includes(window.location.pathname.split('/')[1])) {
                localStorage.removeItem('token');
                window.location.replace(import.meta.env.VITE_APP_BASE_ROUTE + '/login');
            }
        }
    }
    return Promise.reject(error);
};

const setupInterceptorsTo = (axiosInstance: any) => {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
};

const HttpService = setupInterceptorsTo(
    axios.create({
        baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    })
);

export default HttpService;
