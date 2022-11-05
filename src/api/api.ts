import http from "./http";

export default {
  login(params: any) {
    return http.post("/user/login", params);
  },
  home() {
    return http.get("/pageInit/home");
  },
  getFileList(params: any) {
    return http.get(`/file/getFileList?path=${params.path}`);
  },
};
