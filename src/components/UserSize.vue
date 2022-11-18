<template>
  <div class="userSize">
    <hdd-outlined />
    <div class="userSizeRight">
      <p style="margin: 0">存储空间</p>
      <a-progress :percent="state.percent" :show-info="false" />
      <a-breadcrumb style="margin: 0">
        <a-breadcrumb-item>{{ state.sizeUseStr }}</a-breadcrumb-item>
        <a-breadcrumb-item>{{ state.sizeMaxStr }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
  </div>
</template>

<script lang="ts">
import { HddOutlined } from "@ant-design/icons-vue";
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  onUpdated,
  reactive,
  ref,
  watch,
} from "vue";
import store from "../store";
interface state {
  sizeUse: number;
  sizeUseStr: string;
  sizeMax: number;
  sizeMaxStr: string;
  percent: number;
}
export default defineComponent({
  name: "UserSize",
  components: { HddOutlined },
  setup() {
    const state = reactive<state>({
      sizeUse: 0,
      sizeUseStr: "0",
      sizeMax: 0,
      sizeMaxStr: "0",
      percent: 0,
    });

    let user = computed(() => store.state.user);
    const kb = 1024;
    const mb = kb * 1024;
    const gb = mb * 1024;

    watch(user, (newValue) => {
      state.sizeUse = newValue?.sizeUse;
      state.sizeMax = newValue?.sizeMax;
      state.percent = Number(((state.sizeUse / state.sizeMax) * 99).toFixed(2));
      if (state.sizeUse / gb >= 1) {
        state.sizeUseStr = (state.sizeUse / gb).toFixed(0) + "GB";
      } else if (state.sizeUse / mb >= 1) {
        state.sizeUseStr = (state.sizeUse / mb).toFixed(0) + "MB";
      } else {
        state.sizeUseStr = (state.sizeUse / kb).toFixed(0) + "kB";
      }
      if (state.sizeMax / gb >= 1) {
        state.sizeMaxStr = (state.sizeMax / gb).toFixed(0) + "GB";
      } else if (state.sizeMax / mb >= 1) {
        state.sizeMaxStr = (state.sizeMax / mb).toFixed(0) + "MB";
      } else {
        state.sizeMaxStr = (state.sizeMax / kb).toFixed(0) + "kB";
      }
    });

    return {
      state,
    };
  },
});
</script>

<style scoped>
.userSize {
  width: 199px;
  height: 80px;
  left: 0;
  bottom: 0;
  position: fixed;
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.userSize >>> svg {
  width: 2em;
  height: 2em;
}
.userSizeRight {
  flex: 1;
  margin-left: 5px;
}
</style>
