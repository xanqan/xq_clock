<template>
  <div class="AudioFixed">
    <a-button shape="circle" size="large" @click="close">
      <template #icon>
        <close-outlined />
      </template>
    </a-button>
    <audio style="width: 300px" controls>
      <source :src="state.src" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script lang="ts">
import { CloseOutlined } from "@ant-design/icons-vue";
import { defineComponent, reactive } from "vue";
import store from "../store";
interface state {
  src: string;
}
export default defineComponent({
  name: "AudioFixed",
  components: { CloseOutlined },
  setup() {
    const state = reactive<state>({
      src: store.state.audioFixedSrc,
    });

    function close() {
      store.commit("audioFixedClose");
    }

    return {
      state,
      close,
    };
  },
});
</script>

<style scoped>
.AudioFixed {
  display: flex;
  align-items: center;
  position: fixed;
  top: 120px;
  right: 5px;
}
</style>
