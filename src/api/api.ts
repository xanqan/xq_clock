import http from "./http";

export default {
  login(params: any) {
    return http.post("/user/login", params, {});
  },
};
