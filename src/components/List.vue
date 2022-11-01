<template>
  <div class="gutter-example">
    <a-dropdown :trigger="['contextmenu']">
      <div class="mongolia"></div>
      <template #overlay>
        <a-menu>
          <a-menu-item key="1">1st menu item_list</a-menu-item>
          <a-menu-item key="2">2nd menu item</a-menu-item>
          <a-menu-item key="3">3rd menu item</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item>List</a-breadcrumb-item>
      <a-breadcrumb-item>App</a-breadcrumb-item>
    </a-breadcrumb>
    <h3 v-if="state.folders.length">文件夹</h3>
    <a-row :gutter="[18, 10]">
      <a-col class="gutter-row" v-for="file in state.folders" :key="file.id">
        <div class="gutter-box">
          <Fileblock :file="file" />
        </div>
      </a-col>
    </a-row>
    <h3 v-if="state.files.length">文件</h3>
    <a-row :gutter="[18, 10]">
      <a-col class="gutter-row" v-for="file in state.files" :key="file.id">
        <div class="gutter-box">
          <Fileblock :file="file" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onBeforeMount } from "vue";
import api from "../api/api";
import store from "../store";
import { File } from "../interface";
import Fileblock from "../components/Fileblock.vue";
import router from "../router";
interface state {
  fileInfos: File[];
  files: File[];
  folders: File[];
}
export default defineComponent({
  name: "List",
  components: {
    Fileblock,
  },
  setup() {
    const state = reactive<state>({
      fileInfos: [],
      files: [],
      folders: [],
    });

    onBeforeMount(() => {
      api.home().then((res: any) => {
        if (res.code == 200) {
          store.commit("setUser", res.data.user);
          state.fileInfos = res.data.files;
          state.fileInfos.forEach(classify);
        } else if (res.code == 40402) {
          console.log(res.message);
          store.commit("setToken", "");
          router.push("/login");
        } else {
          console.log(res);
        }
      });
    });

    function classify(value: File) {
      if (value.isFolder) {
        state.folders.push(value);
      } else {
        state.files.push(value);
      }
    }

    return {
      state,
    };
  },
});
</script>

<style scoped>
.mongolia {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  position: fixed;
}
.gutter-example :deep(.ant-row > div) {
  background: transparent;
  border: 0;
}
.gutter-box {
  padding: 5px 0;
}
</style>
