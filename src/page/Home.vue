<template>
  <a-layout style="height: 100%; width: 100%">
    <a-layout-header class="header" style="background: #05348b">
      <menu-outlined
        class="trigger"
        @click="state.collapsed = !state.collapsed"
      />
      <div class="logo">xqcloud</div>
      <div class="topMenu">
        <setting-filled />
        <a-dropdown>
          <user-outlined style="margin: 0 0 0 20px" />
          <template #overlay>
            <a-menu>
              <a-menu-item @click="logout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider
        class="a-layout-sider"
        v-model:collapsed="state.collapsed"
        :trigger="null"
      >
        <a-menu
          v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          class="menu"
        >
          <a-sub-menu key="sub1">
            <template #title>
              <folder-open-outlined />
              <span> 我的文件 </span>
            </template>
            <a-menu-item key="1" @click="home"
              ><camera-outlined /><span>全部文件</span></a-menu-item
            >
            <a-menu-item key="2" @click="typeFile(`video`)"
              ><camera-outlined /><span>视频</span></a-menu-item
            >
            <a-menu-item key="3" @click="typeFile(`photo`)"
              ><picture-outlined /><span>图片</span></a-menu-item
            >
            <a-menu-item key="4" @click="typeFile(`audio`)"
              ><customer-service-outlined /><span>音频</span></a-menu-item
            >
            <a-menu-item key="5" @click="typeFile(`text`)"
              ><file-word-outlined /><span>文档</span></a-menu-item
            >
          </a-sub-menu>
          <a-menu-item key="sub2" @click="shareList">
            <laptop-outlined />
            <span> 我的分享 </span>
          </a-menu-item>
          <a-menu-item key="sub3" @click="sizeList">
            <notification-outlined />
            <span> 容量配额 </span>
          </a-menu-item>
        </a-menu>
        <UserSize />
      </a-layout-sider>
      <a-layout>
        <a-layout-content style="background-color: #fff; position: relative">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css";
import {
  FolderOpenOutlined,
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  MenuOutlined,
  SettingFilled,
  FileWordOutlined,
  CameraOutlined,
  PictureOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, reactive, ref } from "vue";
import router from "../router";
import UserSize from "../components/UserSize.vue";
interface state {
  selectedKeys: string[];
  collapsed: boolean;
}
export default defineComponent({
  name: "Home",
  components: {
    UserSize,
    FolderOpenOutlined,
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    MenuOutlined,
    SettingFilled,
    FileWordOutlined,
    CameraOutlined,
    PictureOutlined,
    CustomerServiceOutlined,
  },
  setup() {
    const state = reactive<state>({
      selectedKeys: ["1"],
      collapsed: false,
    });

    function home() {
      router.push({ name: "List" });
    }

    function typeFile(type: string) {
      router.push({ name: "typeList", params: { type: type } });
    }

    function shareList() {
      router.push({ name: "shareList" });
    }

    function sizeList() {
      router.push({ name: "sizeList" });
    }

    function logout() {
      localStorage.clear();
      router.push(`/login`);
    }

    return {
      state,
      home,
      typeFile,
      shareList,
      sizeList,
      logout,
      openKeys: ref<string[]>(["sub1"]),
      selectedKeys: ref<string[]>(["1"]),
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0 30px;
}
.trigger {
  color: #fff;
}
.topMenu {
  color: #fff;
  flex: 1;
  text-align: right;
}
.trigger >>> svg,
.topMenu >>> svg {
  width: 1.5em;
  height: 1.5em;
}
.menu >>> svg {
  width: 1.3em;
  height: 1.3em;
}
.logo {
  color: #fff;
  font-size: xx-large;
  margin: 0 0 10px 20px;
}
.a-layout-sider {
  background: #fff;
  border-right: 1px solid #f0f0f0;
  position: relative;
}
.a-layout-sider {
  height: 100%;
  background: #fff;
  border-right: 1px solid #f0f0f0;
}
</style>
