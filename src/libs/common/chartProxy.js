import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://wc5toelfc4.execute-api.ap-northeast-2.amazonaws.com",
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
  timeout: 5000,
});

export default axiosInstance;
