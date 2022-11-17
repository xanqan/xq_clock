export interface User {
  id: number | undefined;
  name: string | undefined;
  nickName: string | undefined;
  avatar: string | undefined;
  sizeMax: number | undefined;
  sizeUse: number | undefined;
}

export interface File {
  id: number | undefined;
  name: string | undefined;
  path: string | undefined;
  fileSize: number | undefined;
  type: string | undefined;
  contentType: string | undefined;
  createTime: string | undefined;
  modifyTime: string | undefined;
  size: string | undefined;
  duration: string | undefined;
  isFolder: number | undefined;
}

export interface Path {
  id: number;
  name: string;
}

export interface FileProgress {
  id: number;
  name: string;
  path: string;
  type: string;
  file: any;
  percent: number;
  status: string;
  isUpload: boolean;
}
