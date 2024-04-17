import axios from "axios";
import Env from "~/shared/env";
import SessionStorage, { SESSION_ITEMS } from "~/shared/storage/session";

const axiosInstance = axios.create({
  baseURL: Env.apiBaseUrl,
  headers: {
    Authorization: SessionStorage.getItem(SESSION_ITEMS.accessToken),
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = SessionStorage.getItem(SESSION_ITEMS.accessToken);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
