import { createStore } from "vuex";
import { User, File } from "../interface";

export interface ModuleState {
  token: string | null;
  user: User | null;
  isFileSort: number;
  copyFile: File | undefined;
  isCopy: number;
}

export default createStore({
  state: (): ModuleState => ({
    token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
    user: null,
    isFileSort: 1,
    copyFile: undefined,
    isCopy: 1,
  }),
  mutations: {
    setToken(state: ModuleState, date: any) {
      state.token = date;
      localStorage.setItem("token", date);
    },
    setUser(state: ModuleState, date: any) {
      state.user = date;
    },
    updateIsFileSort(state: ModuleState) {
      state.isFileSort != 3 ? ++state.isFileSort : (state.isFileSort = 1);
    },
    setCopyFile(state: ModuleState, date: File) {
      state.copyFile = date;
      state.isCopy = 1;
    },
    setMoveFile(state: ModuleState, date: File) {
      state.copyFile = date;
      state.isCopy = 0;
    },
  },
  actions: {},
  modules: {},
});
