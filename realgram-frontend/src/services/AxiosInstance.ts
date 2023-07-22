import CacheManager from "@/utils/CacheManager";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_ROOT,
  headers: {
    "Content-type": "application/json",
  },
});

axiosInstance.interceptors.request.use((requestConfig) => {
  const token = CacheManager.get("__token");

  if (token) {
    requestConfig.headers["x-access-token"] = token;
  }
  return requestConfig;
});

export default axiosInstance;
