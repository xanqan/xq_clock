import { createStore } from "vuex";

export interface ModuleState {
  token: string | null;
}

export default createStore({
  state: (): ModuleState => ({
    token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
  }),
  mutations: {
    login(state: ModuleState, date: any) {
      state.token = date.token;
    },
  },
  actions: {},
  modules: {},
});
