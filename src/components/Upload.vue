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
      <a-dropdown placement="top">
        <setting-filled />
        <template #overlay>
          <a-menu>
            <a-menu-item @click="state.isSuccessHidden = true">
              隐藏成功上传文件
            </a-menu-item>
            <a-menu-item @click="state.isSuccessHidden = false">
              显示成功上传文件
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <delete-outlined v-if="state.isUp" @click="deleteAllFileProgress" />
      <a-dropdown placement="top">
        <plus-outlined />
        <template #overlay>
          <a-menu>
            <a-menu-item @click="fileClick"> 上传文件 </a-menu-item>
            <a-menu-item @click="folderClick"> 上传文件夹 </a-menu-item>
          </a-menu>
        </template> </a-dropdown
      ><input
        type="file"
        id="inputer"
        style="display: none"
        @change="upload"
        required
      />
      <input
        type="file"
        id="inputerFolder"
        style="display: none"
        @change="upload"
        webkitdirectory
        required
      />
      <up-outlined v-if="!state.isUp" @click="state.isUp = true" />
      <down-outlined v-else @click="state.isUp = false" />
    </div>
  </div>
  <div v-if="state.isUp" class="upMenu">
    <div v-for="value in state.fileProgress" :key="value.id">
      <div
        class="name"
        v-if="state.isSuccessHidden == false || value.status != 'success'"
      >
        <picture-two-tone />
        <div style="width: 300px">
          <p
            style="
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ value.name }}
          </p>
          <a-progress
            :percent="value.percent"
            :status="value.status"
            style="margin: 0 20px"
          />
        </div>
        <div class="svg" style="flex: 1; text-align: right">
          <redo-outlined
            v-if="value.percent < 100"
            @click="reUpload(value.id)"
            style="margin-right: 10px"
          />
          <folder-outlined
            @click="enterUploadPath(value.path)"
            style="margin-right: 10px"
          />
          <delete-outlined @click="deleteFileProgress(value)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SparkMD5 from "spark-md5";
import {
  DownloadOutlined,
  CloseOutlined,
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  PictureTwoTone,
  DeleteOutlined,
  FolderOutlined,
  RedoOutlined,
  SettingFilled,
} from "@ant-design/icons-vue";
import { defineComponent, reactive, ref, watch } from "vue";
import { FileProgress } from "../interface";
import api from "../api/api";
import store from "../store";
import { message } from "ant-design-vue";
interface state {
  isOpen: boolean;
  isUp: boolean;
  isSuccessHidden: boolean;
  fileProgress: FileProgress[];
  sameTimeUploadLimit: number;
  chunkSize: number;
}
export default defineComponent({
  name: "Upload",
  emits: ["fileUpload", "enterUploadPath"],
  components: {
    DownloadOutlined,
    CloseOutlined,
    PlusOutlined,
    UpOutlined,
    DownOutlined,
    PictureTwoTone,
    DeleteOutlined,
    FolderOutlined,
    RedoOutlined,
    SettingFilled,
  },
  setup(props, context) {
    const state = reactive<state>({
      isOpen: false,
      isUp: false,
      isSuccessHidden: false,
      fileProgress: localStorage.getItem("fileProgress")
        ? JSON.parse(localStorage.getItem("fileProgress") as string)
        : [],
      sameTimeUploadLimit: 0,
      chunkSize: 5 * 1024 * 1024,
    });

    let uploadStart = ref<number>(0);
    watch(
      [() => state.sameTimeUploadLimit, uploadStart],
      ([newValue, uploadStart]) => {
        if (newValue > 5) {
          console.log("上传队列满了");
        } else {
          for (let index in state.fileProgress) {
            const fileProgress = state.fileProgress[index];
            if (!fileProgress.isUpload) {
              uploadReadSize(fileProgress);
              break;
            }
          }
        }
      }
    );

    let fileProgressCache = () => {
      localStorage.setItem("fileProgress", JSON.stringify(state.fileProgress));
    };

    function fileClick() {
      state.isUp = true;
      document.getElementById("inputer")?.click();
    }

    function folderClick() {
      state.isUp = true;
      document.getElementById("inputerFolder")?.click();
    }

    function uploadReadSize(fileProgress: FileProgress) {
      if (fileProgress.file.size < state.chunkSize) {
        uploadFile(fileProgress);
      } else {
        initUploadBigFile(fileProgress);
      }
    }

    function upload(e: any) {
      if (e.target.files.length == 1) {
        const file = e.target.files[0];
        let f = state.fileProgress.find(
          (value: FileProgress) =>
            value.name == file.name && value.path == store.state.path
        );
        if (f != undefined) {
          if (f.percent == 100) {
            message.success(file.name + "上传记录已存在");
            return;
          }
          let index = state.fileProgress.lastIndexOf(f);
          state.fileProgress.splice(index, 1);
        }
        const fileProgress = reactive<FileProgress>({
          id:
            state.fileProgress.length == 0
              ? 0
              : state.fileProgress[state.fileProgress.length - 1].id + 1,
          name: e.target.files[0].name,
          path: store.state.path,
          type: "pohoe",
          file: file,
          status: "active",
          percent: 0,
          isUpload: false,
        });
        state.fileProgress.push(fileProgress);
        fileProgressCache();
        uploadStart.value += 1;
      } else {
        let pathSet = new Set();
        let files = Array.from(e.target.files).filter((value: any) => {
          return value.name != "desktop.ini";
        });
        let fileProgressList: FileProgress[] = [];
        files.forEach((value: any) => {
          let index = value.webkitRelativePath.lastIndexOf("/");
          let path = "";
          if (store.state.path == "/") {
            path = store.state.path + value.webkitRelativePath.slice(0, index);
            pathSet.add(path);
          } else {
            path =
              store.state.path + "/" + value.webkitRelativePath.slice(0, index);
            pathSet.add(path);
          }
          const fileProgress = reactive<FileProgress>({
            id:
              state.fileProgress.length == 0
                ? 0
                : state.fileProgress[state.fileProgress.length - 1].id + 1,
            name: value.name,
            path: path,
            type: "pohoe",
            file: value,
            status: "active",
            percent: 0,
            isUpload: false,
          });
          fileProgressList.push(fileProgress);
        });
        api.folderBatchCreate(Array.from(pathSet)).then((res: any) => {
          if (res.code == 200) {
            context.emit("fileUpload", res.data);
            fileProgressList.forEach((value: FileProgress) => {
              state.fileProgress.push(value);
            });
            fileProgressCache();
            uploadStart.value += 1;
          } else {
            message.error(res.description);
          }
        });
      }
    }

    function uploadFile(fileProgress: FileProgress) {
      const file = fileProgress.file;
      const formData = new FormData();
      formData.append("file", file);
      fileProgress.isUpload = true;
      state.sameTimeUploadLimit += 1;
      api
        .fileUpload(
          { path: fileProgress.path, formData: formData },
          (progressEvent: any) => {
            if (progressEvent.lengthComputable) {
              fileProgress.percent = Number(
                ((progressEvent.loaded / progressEvent.total) * 99).toFixed(2)
              );
              fileProgressCache();
            }
          }
        )
        .then((res: any) => {
          if (res.code == 200) {
            if (res.data.path == store.state.path) {
              context.emit("fileUpload", res.data);
            }
            fileProgress.percent = 100;
            fileProgress.status = "success";
          } else {
            deleteFileProgress(fileProgress);
          }
        })
        .catch((res: any) => {
          fileProgress.status = "exception";
        })
        .finally(() => {
          state.sameTimeUploadLimit -= 1;
          fileProgressCache();
        });
    }

    function initUploadBigFile(fileProgress: FileProgress) {
      let fileChunks: any[] = [];
      let promise: any[] = [];
      let count = 0;
      while (count < fileProgress.file.size) {
        fileChunks.push({
          id: count / state.chunkSize,
          blob: fileProgress.file.slice(count, count + state.chunkSize),
        });
        count += state.chunkSize;
      }
      let spark = new SparkMD5.ArrayBuffer();
      fileChunks.forEach((value: any) => {
        let p = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(value.blob);
          reader.onload = (e: any) => {
            spark.append(e.target.result);
            let md5 = spark.end();
            value.md5 = md5;
            resolve(value);
          };
        });
        promise.push(p);
      });
      Promise.all(promise).then((res: any) => {
        api
          .initBigFileUpload({
            path: fileProgress.path,
            name: fileProgress.name,
            fileChunks: res,
          })
          .then((res: any) => {
            if (res.code == 200) {
              fileProgress.percent = Number(
                (
                  ((fileChunks.length - res.data.length) / fileChunks.length) *
                  99
                ).toFixed(2)
              );
              uploadBigFile(fileProgress, fileChunks, res.data);
            }
          });
      });
    }

    function uploadBigFile(
      fileProgress: FileProgress,
      fileChunks: any,
      nowUpload: any
    ) {
      fileProgress.isUpload = true;
      state.sameTimeUploadLimit += 1;
      uploadBigFileItem(fileProgress, fileChunks, nowUpload, 0);
    }

    async function uploadBigFileItem(
      fileProgress: FileProgress,
      fileChunks: any,
      nowUpload: any,
      i: number
    ) {
      const res_1 = await new Promise((resolve, reject) => {
        if (i >= nowUpload.length) {
          return resolve(undefined);
        } else {
          let fileChunk = fileChunks.find((e: any) => e.id == nowUpload[i].id);
          const formData = new FormData();
          formData.append("file", fileChunk.blob);
          api
            .bigFileUpload(
              {
                path:
                  fileProgress.path == "/"
                    ? fileProgress.path + fileProgress.name
                    : fileProgress.path + "/" + fileProgress.name,
                chunkId: fileChunk.id,
                formData: formData,
              },
              (progressEvent: any) => {
                if (progressEvent.lengthComputable) {
                  fileProgress.percent +=
                    Number(
                      (
                        (progressEvent.loaded / progressEvent.total) *
                        99
                      ).toFixed(2)
                    ) / fileChunks.length;
                }
              }
            )
            .then((res: any) => {
              if (res.code == 200) {
                return resolve(res.data);
              } else {
                message.error(res.description);
              }
            })
            .finally(() => {
              fileProgressCache();
            });
        }
      });
      if (res_1 == null) {
        uploadBigFileItem(fileProgress, fileChunks, nowUpload, ++i);
      } else {
        context.emit("fileUpload", res_1);
        fileProgress.status = "success";
        fileProgress.percent = 100;
        fileProgressCache();
        state.sameTimeUploadLimit -= 1;
      }
    }

    function deleteFileProgress(value: FileProgress) {
      let index = state.fileProgress.lastIndexOf(value);
      state.fileProgress.splice(index, 1);
      fileProgressCache();
    }

    function deleteAllFileProgress() {
      state.fileProgress.length = 0;
      fileProgressCache();
    }

    function enterUploadPath(path: string) {
      context.emit("enterUploadPath", path);
    }

    function reUpload(id: number) {
      fileClick();
    }

    return {
      state,
      fileClick,
      folderClick,
      upload,
      deleteFileProgress,
      deleteAllFileProgress,
      enterUploadPath,
      reUpload,
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
  overflow-y: auto;
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
