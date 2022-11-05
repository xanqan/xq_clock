<template>
  <a-dropdown :trigger="['contextmenu']">
    <div v-if="state.file.isFolder" class="name">
      <folder-two-tone />
      <p>{{ state.file.name }}</p>
    </div>
    <div v-else class="file">
      <div v-if="isFileSort == 1" class="img">
        <img style="object-fit: cover" :src="state.src" />
      </div>
      <div class="name">
        <picture-two-tone />
        <p>{{ state.file.name }}</p>
      </div>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1" @click="setCopyFile">复制</a-menu-item>
        <a-menu-item key="2">//粘贴</a-menu-item>
        <a-menu-item key="3">重命名</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { FolderTwoTone, PictureTwoTone } from "@ant-design/icons-vue";
import { defineComponent, reactive, computed } from "vue";
import { File } from "../interface";
import store from "../store";
interface state {
  file: File;
  src: string | undefined;
}
export default defineComponent({
  name: "Fileblock",
  props: ["file"],
  components: { FolderTwoTone, PictureTwoTone },
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
      "/" +
      state.file.name;

    function setCopyFile() {
      store.commit("setCopyFile", state.file);
    }

    return {
      state,
      isFileSort: computed(() => store.state.isFileSort),
      setCopyFile,
    };
  },
});
</script>

<style scoped>
.name {
  display: flex;
  align-items: center;
  padding: 0 10px 0 15px;
  height: 50px;
  width: 200px;
  border-radius: 6px;
  border: 1px solid #00a0e9;
}
.name >>> svg {
  width: 1.5em;
  height: 1.5em;
}
.name p {
  font-size: initial;
  margin: 0 0 4px 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file {
  /* height: 200px; */
  width: 200px;
  border-radius: 6px;
  border: 1px solid #00a0e9;
}
.file .name {
  border: hidden;
}
.img {
  width: 100%;
  height: 150px;
}
.img img {
  width: 100%;
  height: 100%;
}
</style>
