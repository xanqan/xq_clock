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
  fileUpload(params: any, onUploadProgress: any) {
    return http.upload(
      `/file/upload?path=${params.path}`,
      params.formData,
      onUploadProgress
    );
  },
  initBigFileUpload(params: any) {
    return http.post(`/file/initBigFileUpload`, params);
  },
  bigFileUpload(params: any, onUploadProgress: any) {
    return http.upload(
      `/file/bigFileUpload?path=${params.path}&chunkId=${params.chunkId}`,
      params.formData,
      onUploadProgress
    );
  },
  fileDelete(params: any) {
    return http.post(`/file/delete`, params);
  },
  fileReName(params: any) {
    return http.post(`/file/reName`, params);
  },
  fileMove(params: any) {
    return http.post(`/file/move`, params);
  },
  fileCopy(params: any) {
    return http.post(`/file/copy`, params);
  },
  folderCreate(params: any) {
    return http.post(`/file/createFolder`, params);
  },
  folderBatchCreate(params: any) {
    return http.post(`/file/createFolderBatch`, params);
  },
  folderDelete(params: any) {
    return http.post(`/file/deleteFolder`, params);
  },
  folderReName(params: any) {
    return http.post(`/file/reNameFolder`, params);
  },
  folderMove(params: any) {
    return http.post(`/file/moveFolder`, params);
  },
  folderCopy(params: any) {
    return http.post(`/file/copyFolder`, params);
  },
};
