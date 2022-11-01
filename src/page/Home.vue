<template>
  <a-layout>
    <a-layout-header class="header">
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
              <a-menu-item>1st menu item </a-menu-item>
              <a-menu-item>2nd menu item </a-menu-item>
              <a-menu-item @click="logout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider
        style="background: #fff"
        v-model:collapsed="state.collapsed"
        :trigger="null"
      >
        <a-menu
          v-model:selectedKeys="selectedKeys2"
          v-model:openKeys="openKeys"
          mode="inline"
        >
          <a-sub-menu key="sub1">
            <template #title>
              <user-outlined />
              <span> subnav 1 </span>
            </template>
            <a-menu-item key="1" @click="Option_1">option1</a-menu-item>
            <a-menu-item key="2">option2</a-menu-item>
            <a-menu-item key="3">option3</a-menu-item>
            <a-menu-item key="4">option4</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #title>
              <laptop-outlined />
              <span> subnav 2 </span>
            </template>
            <a-menu-item key="5" @click="Option_2">option5</a-menu-item>
            <a-menu-item key="6">option6</a-menu-item>
            <a-menu-item key="7">option7</a-menu-item>
            <a-menu-item key="8">option8</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <template #title>
              <notification-outlined />
              <span> subnav 3 </span>
            </template>
            <a-menu-item key="9">option9</a-menu-item>
            <a-menu-item key="10">option10</a-menu-item>
            <a-menu-item key="11">option11</a-menu-item>
            <a-menu-item key="12">option12</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '0 24px 24px 24px',
            margin: 0,
            minHeight: '280px',
          }"
        >
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  MenuOutlined,
  SettingFilled,
} from "@ant-design/icons-vue";
import { defineComponent, reactive, ref } from "vue";
import router from "../router";
interface state {
  selectedKeys: string[];
  collapsed: boolean;
}
export default defineComponent({
  name: "Home",
  components: {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    MenuOutlined,
    SettingFilled,
  },
  setup() {
    const state = reactive<state>({
      selectedKeys: ["1"],
      collapsed: false,
    });

    function Option_1() {
      console.log("Option_1");
      router.push(`/home`);
    }

    function Option_2() {
      console.log("Option_2");
      router.push(`/home/favorites`);
    }

    function logout() {
      localStorage.clear();
      router.push(`/login`);
    }

    return {
      state,
      Option_1,
      Option_2,
      logout,
      selectedKeys1: ref<string[]>(["2"]),
      selectedKeys2: ref<string[]>(["1"]),
      openKeys: ref<string[]>(["sub1"]),
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
.logo {
  color: #fff;
  font-size: xx-large;
  margin: 0 0 10px 20px;
}
</style>
