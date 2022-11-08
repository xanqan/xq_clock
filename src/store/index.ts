import { createStore } from "vuex";
import { User, File } from "../interface";

export interface ModuleState {
  token: string | null;
  user: User | null;
  isFileSort: number;
  path: string;
  copyFile: File | undefined;
  isCopy: number;
}

export default createStore({
  state: (): ModuleState => ({
    token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
    user: null,
    isFileSort: 1,
    path: "/",
    copyFile: undefined,
    isCopy: 1,
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
  },
  actions: {},
  modules: {},
});
