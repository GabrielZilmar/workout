import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: process.env.REACT_APP_API_BASE_URL,
  baseURL: "process.env.REACT_APP_API_BASE_URL",
  headers: {
    // Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
  },
});
