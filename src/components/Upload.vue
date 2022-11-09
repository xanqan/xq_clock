<template>
  <div class="mongolia" v-if="state.isUp" @click="state.isUp = false"></div>
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
      <plus-outlined @click="fileClick" /><input
        type="file"
        id="inputer"
        style="display: none"
        @change="upload"
        required
      />
      <up-outlined v-if="!state.isUp" @click="state.isUp = true" />
      <down-outlined v-else @click="state.isUp = false" />
    </div>
  </div>
  <div v-if="state.isUp" class="upMenu">
    <div class="name" v-for="value in state.fileProgress" :key="value.id">
      <picture-two-tone />
      <div style="width: 300px">
        <p>{{ value.name }}</p>
        <a-progress
          :percent="value.percent"
          :status="value.status"
          style="margin: 0 20px"
        />
      </div>
      <div class="svg" style="flex: 1; text-align: right">
        <folder-outlined style="margin-right: 10px" />
        <delete-outlined @click="deleteFileProgress(value)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  DownloadOutlined,
  CloseOutlined,
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  PictureTwoTone,
  DeleteOutlined,
  FolderOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, reactive, watch } from "vue";
import { FileProgress } from "../interface";
import api from "../api/api";
import store from "../store";
interface state {
  isOpen: boolean;
  isUp: boolean;
  fileProgress: FileProgress[];
}
export default defineComponent({
  name: "Upload",
  emits: ["fileUpload"],
  components: {
    DownloadOutlined,
    CloseOutlined,
    PlusOutlined,
    UpOutlined,
    DownOutlined,
    PictureTwoTone,
    DeleteOutlined,
    FolderOutlined,
  },
  setup(props, context) {
    const state = reactive<state>({
      isOpen: false,
      isUp: false,
      fileProgress: localStorage.getItem("fileProgress")
        ? JSON.parse(localStorage.getItem("fileProgress") as string)
        : [],
    });

    watch(state.fileProgress, (newValue) => {
      localStorage.setItem("fileProgress", JSON.stringify(newValue));
    });

    function fileClick() {
      document.getElementById("inputer")?.click();
    }

    function upload(e: any) {
      state.isUp = true;
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      const fileProgress = reactive<FileProgress>({
        id:
          state.fileProgress.length == 0
            ? 0
            : state.fileProgress[state.fileProgress.length - 1].id + 1,
        name: e.target.files[0].name,
        path: store.state.path,
        type: "pohoe",
        status: "active",
        percent: 0,
        isUpload: false,
      });
      state.fileProgress.push(fileProgress);
      api
        .fileUpload(store.state.path, formData, (progressEvent: any) => {
          if (progressEvent.lengthComputable) {
            fileProgress.percent = Number(
              ((progressEvent.loaded / progressEvent.total) * 99).toFixed(2)
            );
          }
        })
        .then((res: any) => {
          if (res.code == 200) {
            context.emit("fileUpload", res.data);
            state.fileProgress.forEach((value: FileProgress) => {
              if (value.name == res.data.name && value.path == res.data.path) {
                value.percent = 100;
              }
            });
            fileProgress.status = "success";
          } else {
            deleteFileProgress(fileProgress);
          }
        })
        .catch((res: any) => {
          fileProgress.status = "exception";
        });
    }

    function deleteFileProgress(value: FileProgress) {
      let index = state.fileProgress.lastIndexOf(value);
      state.fileProgress.splice(index, 1);
    }

    return {
      state,
      fileClick,
      upload,
      deleteFileProgress,
    };
  },
});
</script>

<style scoped>
.mongolia {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.button {
  position: fixed;
  bottom: 30px;
  right: 40px;
  background: #05348b;
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
.name {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  border-bottom: 1px solid #00a0e9;
}
.name >>> svg {
  width: 2em;
  height: 2em;
}
.name p {
  margin: 0 20px;
  font-size: larger;
}
.name .svg >>> svg {
  width: 1.5em;
  height: 1.5em;
}
</style>
