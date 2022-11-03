<template>
  <a-dropdown :trigger="['contextmenu']">
    <div v-if="state.file.isFolder" class="name">
      <folder-two-tone />
      <p>{{ state.file.name }}</p>
    </div>
    <div v-else class="name">
      <picture-two-tone />
      <p>{{ state.file.name }}</p>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">1st menu item_{{ state.file.name }}</a-menu-item>
        <a-menu-item key="2">2nd menu item</a-menu-item>
        <a-menu-item key="3">3rd menu item</a-menu-item>
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
interface state {}
export default defineComponent({
  name: "FileLine",
  props: ["file"],
  components: { FolderTwoTone, PictureTwoTone },
  setup(props) {
    const state = reactive<state>({
      file: props.file,
      src: undefined,
    });

    return {
      state,
      isFileSort: computed(() => store.state.isFileSort),
    };
  },
});
</script>

<style scoped>
.name {
  height: 45px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-top: 1px dashed #00a0e9;
}
.name:hover {
  background-color: #d0e8f3;
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
</style>
