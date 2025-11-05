import axios from "axios";

const request = axios.create({
  baseURL: "/", // 可根据实际情况调整
  timeout: 10000
});

// 请求拦截器（可选）
request.interceptors.request.use(
  config => {
    // 可在此处添加token等
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器（可选）
request.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

export default request;
