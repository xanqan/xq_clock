import http from "./http";

export default {
  login(params: any) {
    return http.post("/user/login", params);
  },
  home() {
    return http.get("/pageInit/home");
  },
  getFileListByType(params: any) {
    return http.get(
      `/file/getFileListByType?page=${params.page}&rows=${params.rows}&type=${params.type}`
    );
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
    return http.delete(`/file/delete`, params);
  },
  fileReName(params: any) {
    return http.put(`/file/reName`, params);
  },
  fileMove(params: any) {
    return http.put(`/file/move`, params);
  },
  fileCopy(params: any) {
    return http.put(`/file/copy`, params);
  },
  folderCreate(params: any) {
    return http.post(`/file/createFolder`, params);
  },
  folderBatchCreate(params: any) {
    return http.post(`/file/createFolderBatch`, params);
  },
  folderDelete(params: any) {
    return http.delete(`/file/deleteFolder`, params);
  },
  folderReName(params: any) {
    return http.put(`/file/reNameFolder`, params);
  },
  folderMove(params: any) {
    return http.put(`/file/moveFolder`, params);
  },
  folderCopy(params: any) {
    return http.put(`/file/copyFolder`, params);
  },
  sharecreate(params: any) {
    return http.post(`/file/createShareUrl`, params);
  },
  getShareUrlAll() {
    return http.get(`/file/getShareUrlAll`);
  },
  removeShareUrl(params: any) {
    return http.delete(`/file/removeShareUrl`, params);
  },
};
