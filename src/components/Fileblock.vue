<template>
  <a-dropdown :trigger="['contextmenu']">
    <div v-if="state.file.isFolder" class="name">
      <folder-two-tone />
      <a-input
        v-model:value="state.input"
        :bordered="false"
        class="input"
        @pressEnter="rename"
        @blur="rename"
        @click.stop
      />
    </div>
    <div v-else class="file">
      <div v-if="isFileSort == 1" class="img">
        <img
          v-if="state.file.type == 'photo'"
          style="object-fit: cover"
          :src="state.src"
          @click="state.visible = true"
        />
        <a-image
          v-if="state.file.type == 'photo' && state.visible"
          :width="200"
          :style="{ display: 'none' }"
          :preview="{
            visible: state.visible,
            onVisibleChange: setVisible,
          }"
          :src="state.imgSrc"
        />
        <video
          v-if="state.file.type == 'video'"
          style="width: 100%; height: 100%"
          controls
        >
          <source :src="state.src" type="video/mp4" />
        </video>
        <div
          class="fileImg"
          v-if="state.file.type == 'audio'"
          @click="audioFixed"
        >
          <customer-service-two-tone />
        </div>
        <div
          class="fileImg"
          v-if="state.file.type == 'text'"
          @click="textFixed"
        >
          <file-word-outlined />
        </div>
      </div>
      <div class="name">
        <picture-two-tone />
        <a-input
          v-model:value="state.input"
          :bordered="false"
          class="input"
          @pressEnter="rename"
          @blur="rename"
          @click.stop
        />
      </div>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1" @click="setCopyFile">复制</a-menu-item>
        <a-menu-item key="2" @click="setMoveFile">剪切</a-menu-item>
        <a-menu-item key="2" @click="fileDelete">删除</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css";
import {
  FolderTwoTone,
  PictureTwoTone,
  CustomerServiceTwoTone,
  FileWordOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, reactive, ref, computed } from "vue";
import api from "../api/api";
import { File } from "../interface";
import store from "../store";
import findType from "../hook/findType";
interface state {
  file: File;
  src: string;
  imgSrc: string | undefined;
  input: string;
  visible: boolean;
}
export default defineComponent({
  name: "Fileblock",
  props: ["file"],
  emit: ["fileDelete", "fileReName"],
  components: {
    FolderTwoTone,
    PictureTwoTone,
    CustomerServiceTwoTone,
    FileWordOutlined,
  },
  setup(props, context) {
    const state = reactive<state>({
      file: props.file,
      src: "",
      imgSrc: undefined,
      input: props.file.name,
      visible: false,
    });

    state.file.type = findType(state.file.type);

    if (state.file.type == "photo") {
      state.src =
        "http://121.196.210.13:9000" +
        "/xq" +
        store.state.user?.id +
        "/thumbnail" +
        state.file.id +
        ".jpg";
      state.imgSrc =
        "http://121.196.210.13:9000" +
        "/xq" +
        store.state.user?.id +
        state.file.path +
        "/" +
        state.file.name;
    } else {
      state.src =
        "http://121.196.210.13:9000" +
        "/xq" +
        store.state.user?.id +
        state.file.path +
        "/" +
        state.file.name;
    }

    function setVisible(value: any) {
      state.visible = value;
    }

    function setCopyFile() {
      store.commit("setCopyFile", state.file);
    }

    function setMoveFile() {
      store.commit("setMoveFile", state.file);
    }

    function fileDelete() {
      if (state.file.isFolder) {
        api
          .folderDelete({
            path: state.file.path,
            name: state.file.name,
          })
          .then((res: any) => {
            if (res.code == 200) {
              context.emit("fileDelete", state.file);
              message.success("删除成功");
            } else {
              message.error(res.description);
            }
          });
      } else {
        api
          .fileDelete({
            path: state.file.path,
            name: state.file.name,
          })
          .then((res: any) => {
            if (res.code == 200) {
              context.emit("fileDelete", state.file);
              message.success("删除成功");
            } else {
              message.error(res.description);
            }
          });
      }
    }

    function rename() {
      if (state.input == state.file.name) {
        console.log("相同");
      } else if (state.file.isFolder == 1) {
        api
          .folderReName({
            path: state.file.path,
            name: state.file.name,
            newName: state.input,
          })
          .then((res: any) => {
            if (res.code == 200) {
              state.file.name = state.input;
              context.emit("fileReName", state.file);
              message.success("重命名成功");
            } else {
              message.error(res.description);
            }
          });
      } else {
        api
          .fileReName({
            path: state.file.path,
            name: state.file.name,
            newName: state.input,
          })
          .then((res: any) => {
            if (res.code == 200) {
              state.file.name = state.input;
              context.emit("fileReName", state.file);
              message.success("重命名成功");
            } else {
              message.error(res.description);
            }
          });
      }
    }

    function audioFixed() {
      store.commit("audioFixed", state!.src);
    }

    function textFixed() {
      store.commit("textFixed", state!.src);
    }

    return {
      state,
      isFileSort: computed(() => store.state.isFileSort),
      setVisible,
      setCopyFile,
      setMoveFile,
      fileDelete,
      rename,
      audioFixed,
      textFixed,
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
.name .input {
  font-size: initial;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file {
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
.fileImg {
  padding: 45px 70px;
}

.fileImg >>> svg {
  width: 4em;
  height: 4em;
}
</style>
