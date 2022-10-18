import axios from "axios";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_ENV,
  withCredentials: true,
  timeout: 3000,
});

Axios.interceptors.request.use(
  (request) => {
    console.log(request);
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
      console.info(
        "接口" +
          response.config.url +
          "\n请求成功。请求返回值为" +
          response.data
      );
      return Promise.resolve(response.data.data);
    } else {
      console.log(response.data.message);
      console.log(response.data.description);
      return Promise.resolve(response.data.code);
    }
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

export default {
  get(url: string, params: any) {
    return Axios.get(url, { params: params });
  },

  post(url: string, data: any, config: any) {
    return Axios.post(url, data, config || {});
  },

  put(url: string, data: any, config: any) {
    return Axios.put(url, data, config || {});
  },

  delete(url: string, params: any) {
    return Axios.delete(url, { params: params });
  },
};
