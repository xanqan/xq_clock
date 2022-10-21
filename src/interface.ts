export interface User {
  id: number | null;
  name: string | null;
  nickName: string | null;
  avatar: string | null;
  sizeMax: number | null;
  sizeUse: number | null;
}

export interface File {
  id: number | null;
  name: string | null;
  path: string | null;
  fileSize: number | null;
  createTime: string | null;
  modifyTime: string | null;
  size: string | null;
  duration: string | null;
  isFolder: number | null;
}
