<template>
  <div class="gutter-example">
    <div class="listTop">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>我的分享</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-row :gutter="[18, 10]" class="list">
      <a-col
        class="gutter-row"
        :span="18"
        v-for="share in state.shares"
        :key="share.id"
      >
        <div class="gutter-box">
          <div class="shareBox"></div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onBeforeMount } from "vue";
import { Share } from "../interface";
import api from "../api/api";
import store from "../store";
interface state {
  shares: Share[];
}
export default defineComponent({
  name: "ShareList",
  setup() {
    const state = reactive<state>({
      shares: [],
    });

    onBeforeMount(() => {
      api.getShareUrlAll().then((res: any) => {
        if (res.code == 200) {
          store.commit("setUser", res.data.user);
          state.shares = res.data.shares;
          console.log(state.shares);
        }
      });
    });

    return {
      state,
    };
  },
});
</script>

<style scoped>
.gutter-box {
  padding: 5px 0;
}
.listTop {
  display: flex;
  padding: 0 24px;
}
.listTop >>> svg {
  width: 1.5em;
  height: 1.5em;
}
.list {
  padding: 0 24px;
  width: 100%;
}
.ant-col-18 {
  flex: 0 0 90%;
  max-width: 100%;
  margin: auto;
}
.shareBox {
  height: 100px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid rgb(0 0 0 / 20%);
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
}
</style>
