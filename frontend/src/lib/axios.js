import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
});

// Clerk session cookies don't reliably travel cross-origin (frontend and backend
// are on different Render subdomains), so we manually attach the session token
// as a Bearer header on every request. setAuthTokenGetter() is called once from
// a component that has access to Clerk's useAuth().getToken.
let getToken = null;

export const setAuthTokenGetter = (tokenGetterFn) => {
    getToken = tokenGetterFn;
};

axiosInstance.interceptors.request.use(async (config) => {
    if (getToken) {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default axiosInstance;




// import axios from "axios";

// const axiosInstance = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
// });

// export default axiosInstance;