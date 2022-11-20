<template>
  <div class="ShareFixed">
    <h2>创建分享链接</h2>
    <a-divider />
    <a-form :model="state" autocomplete="off">
      <a-form-item label="过期时间">
        <!-- <a-input v-model:value="state.expire" placeholder="默认为 1 天" /> -->
        <a-select v-model:value="state.expire" :options="options"
          ><template #suffixIcon><span>天</span></template></a-select
        >
      </a-form-item>
      <a-form-item label="分享密码">
        <a-input-password
          v-model:value="state.password"
          placeholder="默认为空"
        />
      </a-form-item>
      <a-divider />
      <a-form-item style="float: right">
        <a-button style="margin-right: 20px" @click="close">关闭</a-button>
        <a-button type="primary" @click="submit">创建分享</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import { defineComponent, reactive, ref } from "vue";
import api from "../api/api";
import store from "../store";
interface state {
  password: string;
  expire: number;
}
export default defineComponent({
  name: "ShareFixed",
  setup() {
    const state = reactive<state>({
      password: "",
      expire: 1,
    });

    function submit() {
      api
        .sharecreate({
          path: store.state.shareFile?.path,
          name: store.state.shareFile?.name,
          password: state.password,
          expire: state.expire,
        })
        .then((res: any) => {
          if (res.code == 200) {
            message.success("创建成功，已复制到剪贴板");
            navigator.clipboard.writeText(res.data.url);
            store.commit("shareFixedClose");
          }
        });
    }

    function close() {
      store.commit("shareFixedClose");
    }

    return {
      state,
      submit,
      close,
      options: [...Array(15)].map((_, i) => ({
        value: i + 1,
      })),
    };
  },
});
</script>

<style scoped>
.ShareFixed {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 300px;
  width: 350px;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #00a0e9;
  background-color: #fff;
}
</style>
