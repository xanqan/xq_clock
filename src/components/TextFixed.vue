<template>
  <div class="TextFixed">
    <a-button
      class="TextFixedButton"
      type="link"
      shape="circle"
      size="large"
      @click="close"
    >
      <template #icon>
        <close-outlined />
      </template>
    </a-button>
    <iframe :src="state.src" width="100%" height="100%"></iframe>
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
  name: "TextFixed",
  components: { CloseOutlined },
  setup() {
    const state = reactive<state>({
      src:
        "http://view.xdocin.com/xdoc?_xdoc=" +
        encodeURIComponent(store.state.textFixedSrc),
    });

    console.log(state.src);
    console.log(store.state.textFixedSrc);

    function close() {
      store.commit("textFixedClose");
    }

    return {
      state,
      close,
    };
  },
});
</script>

<style scoped>
.TextFixed {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: 100%;
}
.TextFixedButton {
  position: absolute;
  top: 0;
  left: 0;
  margin: auto;
}
</style>
