import axios from "axios";
import store from "../store";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_ENV,
  withCredentials: true,
  timeout: 5000,
  headers: {
    authorization: `Bearer ${store.state.token}`,
  },
});

Axios.interceptors.request.use(
  (request) => {
    request.headers!.authorization = `Bearer ${store.state.token}`;
    console.log("发送请求" + "\n" + request.method + "\n" + request.url);
    console.log(request.data);
    return request;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

Axios.interceptors.response.use(
  (response) => {
    if (response.status == 200 && response.data.code == 200) {
      console.log("请求成功" + "\n" + response.config.url);
      console.log(response.data);
      return Promise.resolve(response.data);
    } else {
      console.log("请求失败" + "\n" + response.config.url);
      console.log(response.data);
      return Promise.resolve(response.data);
    }
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

export default {
  get(url: string, params?: any) {
    return Axios.get(url, { params: params });
  },

  post(url: string, data: any, config?: any) {
    return Axios.post(url, data, config || {});
  },

  put(url: string, data: any, config?: any) {
    return Axios.put(url, data, config || {});
  },

  delete(url: string, params: any) {
    return Axios.delete(url, { params: params });
  },
};
