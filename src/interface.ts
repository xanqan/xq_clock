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
  createTime: string | undefined;
  modifyTime: string | undefined;
  size: string | undefined;
  duration: string | undefined;
  isFolder: number | undefined;
}
