import axios from 'axios';

// 创建一个 axios 实例
const http = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://120.55.101.5:3005/', // 基础URL
  timeout: 10000, // 请求超时时间
  withCredentials: true, // 允许携带 cookie
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 可以在这里添加 token 到请求头
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);

export default http;
