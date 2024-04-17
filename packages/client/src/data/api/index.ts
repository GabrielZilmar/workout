import axios from "axios";
import Env from "~/shared/env";

export const axiosInstance = axios.create({
  baseURL: Env.apiBaseUrl,
  headers: {
    // Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
  },
});
