import { createStore } from "vuex";
import { User } from "../interface";

export interface ModuleState {
  token: string | null;
  user: User | null;
  isFileSort: number;
}

export default createStore({
  state: (): ModuleState => ({
    token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
    user: null,
    isFileSort: 1,
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
  },
  actions: {},
  modules: {},
});
