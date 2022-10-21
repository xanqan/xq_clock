<template>
  <div id="Login">
    <a-form
      :model="state"
      name="basic"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="账号"
        name="name"
        :rules="[{ required: true, message: '请输入账号!' }]"
      >
        <a-input v-model:value="state.name" />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input-password v-model:value="state.password" />
      </a-form-item>

      <a-form-item name="remember">
        <a-checkbox v-model:checked="state.remember">记住登录</a-checkbox>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import api from "../api/api";
import router from "../router";
import store from "../store";
interface state {
  name: string;
  password: string;
  remember: boolean;
}
export default defineComponent({
  name: "App",
  setup() {
    const state = reactive<state>({
      name: "",
      password: "",
      remember: true,
    });

    const onFinish = (values: any) => {
      api
        .login({
          name: values.name,
          password: values.password,
        })
        .then((res: any) => {
          if (res.code == 200) {
            store.commit("setToken", res.data);
            router.push("/home");
          } else {
            console.log(res);
          }
        });
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };

    return {
      state,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>

<style scoped>
#Login {
  width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-60%, -50%);
}
</style>
