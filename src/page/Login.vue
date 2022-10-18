<template>
  <div id="Login">
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="账号"
        name="username"
        :rules="[{ required: true, message: '请输入账号!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item name="remember">
        <a-checkbox v-model:checked="formState.remember">记住登录</a-checkbox>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";
import api from "../api/api";
interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
export default defineComponent({
  name: "App",
  setup() {
    const formState = reactive<FormState>({
      username: "",
      password: "",
      remember: true,
    });

    const onFinish = (values: any) => {
      api
        .login({
          name: values.username,
          password: values.password,
        })
        .then((res: any) => {
          if (res != 200) {
            console.log(res);
          } else {
            console.log(res);
            //TODO 业务逻辑
          }
        });
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };

    return {
      formState,
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
