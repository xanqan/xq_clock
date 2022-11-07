<template>
  <a-button
    v-if="!state.isOpen"
    class="button"
    type="primary"
    shape="circle"
    size="large"
    @click="state.isOpen = true"
  >
    <template #icon>
      <download-outlined />
    </template>
  </a-button>
  <div
    v-else
    class="uploadQueue"
    :style="state.isUp == false ? {} : { bottom: '280px' }"
  >
    <close-outlined @click="(state.isOpen = false), (state.isUp = false)" />
    <p style="color: #fff; margin: 0; font-size: large">上传队列</p>
    <div style="flex: 1; text-align: right">
      <plus-outlined />
      <up-outlined v-if="!state.isUp" @click="state.isUp = true" />
      <down-outlined v-else @click="state.isUp = false" />
    </div>
  </div>
  <div v-if="state.isUp" class="upMenu"></div>
</template>

<script lang="ts">
import {
  DownloadOutlined,
  CloseOutlined,
  PlusOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, reactive, ref } from "vue";
interface state {
  isOpen: boolean;
  isUp: boolean;
}
export default defineComponent({
  name: "Upload",
  components: {
    DownloadOutlined,
    CloseOutlined,
    PlusOutlined,
    UpOutlined,
    DownOutlined,
  },
  setup() {
    const state = reactive<state>({
      isOpen: false,
      isUp: false,
    });
    return {
      state,
    };
  },
});
</script>

<style scoped>
.button {
  position: fixed;
  bottom: 30px;
  right: 40px;
}
.uploadQueue {
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  bottom: 30px;
  right: 40px;
  height: 65px;
  width: 500px;
  border-radius: 6px;
  background: #05348b;
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
}
.uploadQueue >>> svg {
  width: 2em;
  height: 2em;
  color: #fff;
  margin-right: 20px;
}
.upMenu {
  position: fixed;
  bottom: 30px;
  right: 40px;
  height: 250px;
  width: 500px;
  border: 1px solid #000;
  border-top: 0;
  border-radius: 6px;
  background: #fff;
}
</style>
