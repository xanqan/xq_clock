import { createStore } from "vuex";
import { User } from "../interface";

export interface ModuleState {
  token: string | null;
  user: User | null;
}

export default createStore({
  state: (): ModuleState => ({
    token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
    user: null,
  }),
  mutations: {
    setToken(state: ModuleState, date: any) {
      state.token = date;
      localStorage.setItem("token", date);
    },
    setUser(state: ModuleState, date: any) {
      state.user = date;
    },
  },
  actions: {},
  modules: {},
});
