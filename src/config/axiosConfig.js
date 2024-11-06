// src/config/axiosConfig.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const axiosInstance = axios.create({
  baseURL: "https://api.duffel.com",
  headers: {
    "Content-Type": "application/json",
    "Duffel-Version": "v2",
    Authorization: `Bearer ${process.env.DUFFEL_AUTH_TOKEN}`,
  },
});

export default axiosInstance;
