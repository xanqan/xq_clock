<template>
  <div class="gutter-example">
    <div class="listTop">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item class="ant-breadcrumb-link" @click="enterPath(-1)"
          >Home</a-breadcrumb-item
        >
        <a-breadcrumb-item
          class="ant-breadcrumb-link"
          v-for="path in state.paths"
          :key="path.id"
          @click="enterPath(path.id)"
          >{{ path.name }}</a-breadcrumb-item
        >
      </a-breadcrumb>
      <div style="margin: 16px 0; flex: 1; text-align: right">
        <appstore-outlined @click="updataIsFileSort" />
      </div>
    </div>
    <div :style="isFileSort != 3 ? listStyle : listStyle2">
      <a-dropdown v-if="isFileSort != 3" :trigger="['contextmenu']">
        <div class="mongolia"></div>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="paste">粘贴</a-menu-item>
            <a-menu-item key="2" @click="createFolder">新建文件夹</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <div v-if="isFileSort != 3">
        <h3 v-if="state.folders.length != 0">文件夹</h3>
        <a-row :gutter="[18, 10]">
          <a-col
            class="gutter-row"
            v-for="file in state.folders"
            :key="file.id"
          >
            <div class="gutter-box">
              <Fileblock
                :file="file"
                @click="enterFolder(file)"
                @fileDelete="fileDelete"
                @fileReName="fileReName"
              />
            </div>
          </a-col>
        </a-row>
        <h3 v-if="state.files.length">文件</h3>
        <a-row :gutter="[18, 10]">
          <a-col class="gutter-row" v-for="file in state.files" :key="file.id">
            <div class="gutter-box">
              <Fileblock
                :file="file"
                @fileDelete="fileDelete"
                @fileReName="fileReName"
              />
            </div>
          </a-col>
        </a-row>
      </div>
      <div v-if="isFileSort == 3">
        <div v-for="file in state.folders" :key="file.id">
          <FileLine :file="file" @click="enterFolder(file)" />
        </div>
        <div v-for="file in state.files" :key="file.id">
          <FileLine :file="file" />
        </div>
      </div>
    </div>
  </div>
  <Upload @fileUpload="fileUpload" @enterUploadPath="enterUploadPath" />
  <AudioFixed v-if="isAudioFixed" />
  <TextFixed v-if="isTextFixed" />
  <ShareFixed v-if="isShareFixed" />
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css";
import { AppstoreOutlined } from "@ant-design/icons-vue";
import { defineComponent, reactive, onBeforeMount, computed, watch } from "vue";
import api from "../api/api";
import store from "../store";
import router from "../router";
import { Path, File } from "../interface";
import Upload from "./Upload.vue";
import Fileblock from "./Fileblock.vue";
import FileLine from "./FileLine.vue";
import AudioFixed from "./AudioFixed.vue";
import TextFixed from "./TextFixed.vue";
import ShareFixed from "./ShareFixed.vue";
interface state {
  paths: Path[];
  fileInfos: File[];
  files: File[];
  folders: File[];
}
export default defineComponent({
  name: "List",
  components: {
    Upload,
    AudioFixed,
    TextFixed,
    ShareFixed,
    Fileblock,
    FileLine,
    AppstoreOutlined,
  },
  setup() {
    const state = reactive<state>({
      paths: [],
      fileInfos: [],
      files: [],
      folders: [],
    });

    let path = computed(() => {
      let path = "";
      if (state.paths.length == 0) {
        path = "/";
      } else {
        state.paths.forEach((value: Path) => {
          path = path + "/" + value.name;
        });
      }
      return path;
    });

    watch(path, (newvalue) => {
      store.commit("setPath", newvalue);
    });

    onBeforeMount(() => {
      api.home().then((res: any) => {
        if (res.code == 200) {
          store.commit("setUser", res.data.user);
          state.fileInfos = res.data.files;
          state.fileInfos.forEach(classify);
        } else if (res.code == 40402) {
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

    function updataIsFileSort() {
      store.commit("updataIsFileSort");
    }

    function enterFolder(file: any) {
      api
        .getFileList({
          path:
            path.value == "/"
              ? path.value + file.name
              : path.value + "/" + file.name,
        })
        .then((res: any) => {
          state.fileInfos.length = 0;
          state.folders.length = 0;
          state.files.length = 0;
          res.data.forEach((value: File) => {
            state.fileInfos.push(value);
          });
          state.fileInfos.forEach(classify);
          state.paths.push({
            id:
              state.paths.length == 0
                ? 0
                : state.paths[state.paths.length - 1].id + 1,
            name: file.name,
          });
        });
    }

    function enterPath(id: any) {
      let path = "/";
      if (typeof id == "number") {
        if (id < 0) {
          console.log("Home");
        } else {
          for (let i = 0; i < id; ++i) {
            path = path + state.paths[i].name + "/";
          }
          path = path + state.paths[id].name;
        }
      } else {
        path = id;
      }
      api
        .getFileList({
          path: path,
        })
        .then((res: any) => {
          state.fileInfos.length = 0;
          state.folders.length = 0;
          state.files.length = 0;
          res.data.forEach((value: File) => {
            state.fileInfos.push(value);
          });
          state.fileInfos.forEach(classify);
          state.paths.splice(id + 1);
        });
    }

    function paste() {
      if (store.state.copyFile == undefined) {
        message.error("还没有复制文件");
      } else if (store.state.isCopy == 1) {
        if (store.state.copyFile.isFolder == 1) {
          api
            .folderCopy({
              path: store.state.copyFile.path,
              name: store.state.copyFile.name,
              newPath: path.value,
            })
            .then((res: any) => {
              if (res.code == 200) {
                let length = state.folders.push(store.state.copyFile as File);
                state.folders[length - 1].path = path.value;
                message.success("粘贴成功");
              } else {
                message.error(res.description);
              }
            });
        } else {
          api
            .fileCopy({
              path: store.state.copyFile.path,
              name: store.state.copyFile.name,
              newPath: path.value,
            })
            .then((res: any) => {
              if (res.code == 200) {
                let length = state.files.push(store.state.copyFile as File);
                state.files[length - 1].path = path.value;
                message.success("粘贴成功");
              } else {
                message.error(res.description);
              }
            });
        }
      } else {
        if (store.state.copyFile.isFolder == 1) {
          api
            .folderMove({
              path: store.state.copyFile.path,
              name: store.state.copyFile.name,
              newPath: path.value,
            })
            .then((res: any) => {
              if (res.code == 200) {
                let length = state.folders.push(store.state.copyFile as File);
                state.folders[length - 1].path = path.value;
                store.commit("setCopyFile", state.files[length - 1]);
                message.success("粘贴成功");
              } else {
                message.error(res.description);
              }
            });
        } else {
          api
            .fileMove({
              path: store.state.copyFile.path,
              name: store.state.copyFile.name,
              newPath: path.value,
            })
            .then((res: any) => {
              if (res.code == 200) {
                let length = state.files.push(store.state.copyFile as File);
                state.files[length - 1].path = path.value;
                store.commit("setCopyFile", state.files[length - 1]);
                message.success("粘贴成功");
              } else {
                message.error(res.description);
              }
            });
        }
      }
    }

    function createFolder() {
      let folderName = "新建文件夹";
      let i = 0;
      do {
        let flag = 0;
        state.folders.forEach((value: File) => {
          if (folderName == value.name) {
            ++i;
            folderName = "新建文件夹" + "(" + i + ")";
            flag = 1;
          }
        });
        if (flag == 0) {
          i = 0;
        }
      } while (i);
      api
        .folderCreate({
          path: path.value,
          name: folderName,
        })
        .then((res: any) => {
          if (res.code == 200) {
            state.folders.push(res.data);
          }
        });
    }

    function fileDelete(file: File) {
      if (file.isFolder == 1) {
        let index = state.folders.lastIndexOf(file);
        state.folders.splice(index, 1);
      } else {
        let index = state.files.lastIndexOf(file);
        state.files.splice(index, 1);
      }
    }

    function fileReName(file: File) {
      if (file.isFolder == 1) {
        let index = state.folders.lastIndexOf(file);
        state.folders[index] == file;
      } else {
        let index = state.files.lastIndexOf(file);
        state.files[index] == file;
      }
    }

    function fileUpload(file: File) {
      if (file.isFolder == 1) {
        state.folders.push(file);
      } else {
        state.files.push(file);
      }
    }

    function enterUploadPath(path: string) {
      enterPath(path);
    }

    return {
      state,
      isFileSort: computed(() => store.state.isFileSort),
      isAudioFixed: computed(() => store.state.isAudioFixed),
      isTextFixed: computed(() => store.state.isTextFixed),
      isShareFixed: computed(() => store.state.isShareFixed),
      listStyle: {
        padding: "0 24px",
      },
      listStyle2: {
        padding: "0",
      },
      updataIsFileSort,
      enterFolder,
      enterPath,
      paste,
      createFolder,
      fileDelete,
      fileReName,
      fileUpload,
      enterUploadPath,
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

.ant-breadcrumb-link {
  cursor: pointer;
}
.ant-breadcrumb-link:hover {
  color: #40a9ff;
}
</style>
