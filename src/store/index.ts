import { createStore } from "vuex";
import { User, File } from "../interface";

export interface ModuleState {
  // 用户 token
  token: string | null;
  // 登录用户信息
  user: User | null;
  // 文件排列方式
  isFileSort: number;
  // 现在路径
  path: string;
  // 待拷贝（剪切）文件
  copyFile: File | undefined;
  // 是否为复制：1为复制，0为剪切
  isCopy: number;
  isAudioFixed: boolean;
  audioFixedSrc: string;
  isTextFixed: boolean;
  textFixedSrc: string;
}

export default createStore({
  state: (): ModuleState => ({
    token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
    user: null,
    isFileSort: 1,
    path: "/",
    copyFile: undefined,
    isCopy: 1,
    isAudioFixed: false,
    audioFixedSrc: "",
    isTextFixed: false,
    textFixedSrc: "",
  }),
  mutations: {
    setToken(state: ModuleState, data: any) {
      state.token = data;
      localStorage.setItem("token", data);
    },
    setUser(state: ModuleState, data: any) {
      state.user = data;
    },
    updataIsFileSort(state: ModuleState) {
      state.isFileSort != 3 ? ++state.isFileSort : (state.isFileSort = 1);
    },
    setPath(state: ModuleState, data: string) {
      state.path = data;
    },
    setCopyFile(state: ModuleState, data: File) {
      state.copyFile = data;
      state.isCopy = 1;
    },
    setMoveFile(state: ModuleState, data: File) {
      state.copyFile = data;
      state.isCopy = 0;
    },
    audioFixed(state: ModuleState, data: string) {
      state.isAudioFixed = true;
      state.audioFixedSrc = data;
    },
    audioFixedClose(state: ModuleState) {
      state.isAudioFixed = false;
      state.audioFixedSrc = "";
    },
    textFixed(state: ModuleState, data: string) {
      state.isTextFixed = true;
      state.textFixedSrc = data;
    },
    textFixedClose(state: ModuleState) {
      state.isTextFixed = false;
      state.textFixedSrc = "";
    },
  },
  actions: {},
  modules: {},
});
