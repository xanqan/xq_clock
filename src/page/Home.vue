<template>
  <a-layout>
    <a-layout-header class="header">
      <menu-unfold-outlined
        v-if="state.collapsed"
        class="trigger"
        @click="collapsed"
      />
      <menu-fold-outlined v-else class="trigger" @click="collapsed" />
      <div class="logo"><p>xqcloud</p></div>
      <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item key="1" @click="collapsed">nav 1</a-menu-item>
        <a-menu-item key="2">nav 2</a-menu-item>
        <a-menu-item key="3">nav 3</a-menu-item>
      </a-menu>
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
  MenuUnfoldOutlined,
  MenuFoldOutlined,
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
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
  setup() {
    const state = reactive<state>({
      selectedKeys: ["1"],
      collapsed: false,
    });

    function collapsed() {
      state.collapsed = !state.collapsed;
    }

    function Option_1() {
      console.log("Option_1");
      router.push(`/home`);
    }

    function Option_2() {
      console.log("Option_2");
      router.push(`/home/favorites`);
    }

    return {
      state,
      collapsed,
      Option_1,
      Option_2,
      selectedKeys1: ref<string[]>(["2"]),
      selectedKeys2: ref<string[]>(["1"]),
      openKeys: ref<string[]>(["sub1"]),
    };
  },
});
</script>

<style scoped>
.trigger {
  float: left;
  color: #fff;
  margin: 20px 24px 16px 0;
}
.trigger >>> svg {
  width: 2em !important;
  height: 2em !important;
}
.logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 0 24px 16px 0;
  color: #fff;
  text-align: center;
  font-size: xx-large;
}
</style>
