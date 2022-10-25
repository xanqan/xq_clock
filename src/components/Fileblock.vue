<template>
  <div class="file">
    <h1 v-if="state.file.isFolder">folder</h1>
    <img v-else class="img" :src="state.src" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { File } from "../interface";
import store from "../store";
interface state {
  file: File;
  src: string | undefined;
}
export default defineComponent({
  name: "Fileblock",
  props: ["file"],
  setup(props) {
    const state = reactive<state>({
      file: props.file,
      src: undefined,
    });

    state.src =
      "http://121.196.210.13:9000" +
      "/xq" +
      store.state.user?.id +
      state.file.path +
      state.file.name;

    return {
      state,
    };
  },
});
</script>

<style scoped>
.file {
  height: 150px;
  width: 150px;
  background: #00a0e9;
}
.img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}
</style>
