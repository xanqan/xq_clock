<template>
  <a-layout class="layout" style="height: 100%">
    <a-layout-header>
      <div class="logo">xqcloud</div>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0"> </a-breadcrumb>
      <div class="Content" v-if="state.share != undefined">
        <picture-two-tone v-if="state.share?.type == 'photo'" />
        <camera-two-tone v-if="state.share?.type == 'video'" />
        <customer-service-two-tone v-if="state.share?.type == 'audio'" />
        <file-word-two-tone v-if="state.share?.type == 'text'" />
        <h1 style="margin-left: 20px">{{ state.share?.name }}</h1>
        <div class="ContentRight">
          <a-input
            v-model:value="state.value"
            placeholder="请输入密码"
            v-if="state.share?.password != ''"
            style="width: 200px; margin-right: 40px"
            @change="change"
          />
          <a-button type="primary" :disabled="state.disabled"
            ><a :href="state.share?.url" :download="state.share?.name"
              >Download</a
            ></a-button
          >
        </div>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center"> </a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css";
import {
  PictureTwoTone,
  CustomerServiceTwoTone,
  FileWordTwoTone,
  CameraTwoTone,
} from "@ant-design/icons-vue";
import { defineComponent, onBeforeMount, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { Share } from "../interface";
import api from "../api/api";
interface state {
  share: Share | undefined;
  disabled: boolean;
  value: string;
}
export default defineComponent({
  name: "Share",
  components: {
    PictureTwoTone,
    CustomerServiceTwoTone,
    FileWordTwoTone,
    CameraTwoTone,
  },
  setup() {
    const state = reactive<state>({
      share: undefined,
      disabled: false,
      value: "",
    });

    const route = useRoute();

    onBeforeMount(() => {
      api
        .getShareUrl({
          shareId: route.params.shareId,
        })
        .then((res: any) => {
          if (res.code == 200) {
            state.share = res.data;
            if (state.share?.password != "") {
              state.disabled = true;
            }
          } else {
            message.error(res.description);
          }
        });
    });

    function change() {
      if (state.value == state.share?.password) {
        message.success("密码正确");
        state.disabled = false;
      } else {
        state.disabled = true;
      }
    }

    return {
      state,
      change,
    };
  },
});
</script>

<style scoped>
.logo {
  color: #fff;
  font-size: xx-large;
  margin: 0 0 10px 20px;
}
.Content {
  background: #fff;
  padding: 100px;
  height: 100%;
  display: flex;
  align-items: center;
}
.Content >>> svg {
  width: 3em;
  height: 3em;
}
.ContentRight {
  flex: 1;
  text-align: right;
}
</style>
