<template>
  <div class="gutter-example">
    <div class="listTop">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      <div style="margin: 16px 0; flex: 1; text-align: right">
        <appstore-outlined @click="updateIsFileSort" />
      </div>
    </div>
    <div :style="isFileSort != 3 ? listStyle : listStyle2">
      <!-- <a-dropdown :trigger="['contextmenu']">
        <div class="mongolia"></div>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1">1st menu item_list</a-menu-item>
            <a-menu-item key="2">2nd menu item</a-menu-item>
            <a-menu-item key="3">3rd menu item</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown> -->
      <div v-if="isFileSort != 3">
        <h3 v-if="state.folders.length != 0">文件夹</h3>
        <a-row :gutter="[18, 10]">
          <a-col
            class="gutter-row"
            v-for="file in state.folders"
            :key="file.id"
          >
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
      <div v-if="isFileSort == 3">
        <div v-for="file in state.folders" :key="file.id">
          <FileLime :file="file" />
        </div>
        <div v-for="file in state.files" :key="file.id">
          <FileLime :file="file" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AppstoreOutlined } from "@ant-design/icons-vue";
import { defineComponent, reactive, onBeforeMount, computed } from "vue";
import api from "../api/api";
import store from "../store";
import { File } from "../interface";
import Fileblock from "../components/Fileblock.vue";
import FileLime from "../components/FileLine.vue";
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
    FileLime,
    AppstoreOutlined,
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

    function updateIsFileSort() {
      store.commit("updateIsFileSort");
    }

    return {
      state,
      isFileSort: computed(() => store.state.isFileSort),
      listStyle: {
        padding: "0 24px",
      },
      listStyle2: {
        padding: "0",
      },
      updateIsFileSort,
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
}
</style>
