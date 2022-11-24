export interface User {
  id: number | undefined;
  name: string | undefined;
  nickName: string | undefined;
  avatar: string | undefined;
  sizeMax: number;
  sizeUse: number;
  modifySize: number;
  isAdmin: number;
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

export interface Share {
  id: number | undefined;
  name: string | undefined;
  path: string | undefined;
  url: string | undefined;
  type: string | undefined;
  password: string | undefined;
  expire: string | undefined;
  expireFormat: string | undefined;
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
