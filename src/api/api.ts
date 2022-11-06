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
  fileCopy(params: any) {
    return http.post(`/file/copy`, params);
  },
  fileMove(params: any) {
    return http.post(`/file/move`, params);
  },
  fileDelete(params: any) {
    return http.post(`/file/delete`, params);
  },
  folderDelete(params: any) {
    return http.post(`/file/deleteFolder`, params);
  },
};
