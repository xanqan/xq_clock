<template>
  <div class="gutter-example">
    <div class="listTop">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>我的分享</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-row :gutter="[18, 10]" class="list">
      <a-col class="gutter-row">
        <div class="shareBox">
          <h1>5GB</h1>
          <h3>用户组基础容量</h3>
        </div>
      </a-col>
      <a-col class="gutter-row">
        <div class="shareBox">
          <h1>{{ state.sizeAddStr }}</h1>
          <h3>附加容量</h3>
        </div>
      </a-col>
      <a-col class="gutter-row">
        <div class="shareBox">
          <h1>{{ state.sizeUseStr }}</h1>
          <h3>已使用容量</h3>
        </div>
      </a-col>
      <a-col class="gutter-row">
        <div class="shareBox">
          <h1>{{ state.sizeMaxStr }}</h1>
          <h3>总容量</h3>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="23">
        <div class="progress">
          <a-progress :percent="state.percent" :show-info="false" />
          <a-breadcrumb style="margin: 0">
            <a-breadcrumb-item>{{ state.sizeUseStr }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ state.sizeMaxStr }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="23" v-if="state.sizeModify != 0">
        <div class="progress">
          <h1>现在正在申请修改容量到 {{ state.sizeModifyStr }}</h1>
          <a-button
            type="primary"
            style="float: right; margin-top: 10px"
            @click="undo"
            >撤销</a-button
          >
        </div>
      </a-col>
      <a-col class="gutter-row">
        <div class="button">
          <a-input v-model:value="state.value" style="width: 100px" />GB
          <a-button type="primary" style="margin-left: 20px" @click="change"
            >申请修改容量</a-button
          >
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onBeforeMount } from "vue";
import { User } from "../interface";
import api from "../api/api";
import store from "../store";
import { message } from "ant-design-vue";
interface state {
  user: User | undefined;
  sizeUse: number;
  sizeUseStr: string;
  sizeMax: number;
  sizeMaxStr: string;
  sizeAdd: number;
  sizeAddStr: string;
  sizeModify: number;
  sizeModifyStr: string;
  percent: number;
  value: number;
}
export default defineComponent({
  name: "SizeList",
  setup() {
    const state = reactive<state>({
      user: undefined,
      sizeUse: 0,
      sizeUseStr: "0",
      sizeMax: 0,
      sizeMaxStr: "0",
      sizeAdd: 0,
      sizeAddStr: "0",
      sizeModify: 0,
      sizeModifyStr: "0",
      percent: 0,
      value: -1,
    });

    const kb = 1024;
    const mb = kb * 1024;
    const gb = mb * 1024;

    onBeforeMount(() => {
      api.getUserInfo().then((res: any) => {
        if (res.code == 200) {
          store.commit("setUser", res.data);
          state.user = res.data;

          state.sizeUse = state.user?.sizeUse;
          state.sizeMax = state.user?.sizeMax;
          state.sizeModify = state.user?.modifySize;
          state.sizeAdd = state.sizeMax - 5368709120;
          state.percent = Number(
            ((state.sizeUse / state.sizeMax) * 99).toFixed(2)
          );
          if (state.sizeUse / gb >= 1) {
            state.sizeUseStr = (state.sizeUse / gb).toFixed(0) + "GB";
          } else if (state.sizeUse / mb >= 1) {
            state.sizeUseStr = (state.sizeUse / mb).toFixed(0) + "MB";
          } else {
            state.sizeUseStr = (state.sizeUse / kb).toFixed(0) + "kB";
          }
          if (state.sizeMax / gb >= 1) {
            state.sizeMaxStr = (state.sizeMax / gb).toFixed(0) + "GB";
          } else if (state.sizeMax / mb >= 1) {
            state.sizeMaxStr = (state.sizeMax / mb).toFixed(0) + "MB";
          } else {
            state.sizeMaxStr = (state.sizeMax / kb).toFixed(0) + "kB";
          }
          if (state.sizeAdd / gb >= 1) {
            state.sizeAddStr = (state.sizeAdd / gb).toFixed(0) + "GB";
          } else if (state.sizeAdd / mb >= 1) {
            state.sizeAddStr = (state.sizeAdd / mb).toFixed(0) + "MB";
          } else {
            state.sizeAddStr = (state.sizeAdd / kb).toFixed(0) + "kB";
          }
          if (state.sizeModify / gb >= 1) {
            state.sizeModifyStr = (state.sizeModify / gb).toFixed(0) + "GB";
          } else if (state.sizeAdd / mb >= 1) {
            state.sizeModifyStr = (state.sizeModify / mb).toFixed(0) + "MB";
          } else {
            state.sizeModifyStr = (state.sizeModify / kb).toFixed(0) + "kB";
          }
        }
      });
    });

    function change() {
      console.log(state.value);
      api
        .applyModifyCapacity({ modifySize: state.value * 1073741824 })
        .then((res: any) => {
          if (res.code == 200) {
            console.log(res.data);
            state.sizeModify = state.value * 1073741824;
            if (state.sizeModify / gb >= 1) {
              state.sizeModifyStr = (state.sizeModify / gb).toFixed(0) + "GB";
            } else if (state.sizeAdd / mb >= 1) {
              state.sizeModifyStr = (state.sizeModify / mb).toFixed(0) + "MB";
            } else {
              state.sizeModifyStr = (state.sizeModify / kb).toFixed(0) + "kB";
            }
          } else {
            message.error(res.description);
          }
        });
    }

    function undo() {
      console.log(state.value);
      api.applyModifyCapacity({ modifySize: 0 }).then((res: any) => {
        if (res.code == 200) {
          console.log(res.data);
          state.sizeModify = 0;
        } else {
          message.error(res.description);
        }
      });
    }

    return {
      state,
      change,
      undo,
    };
  },
});
</script>

<style scoped>
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
  width: 100%;
}
.ant-col-18 {
  flex: 0 0 90%;
  max-width: 100%;
  margin: auto;
}
.shareBox {
  height: 100px;
  width: 250px;
  padding: 10px 30px;
  border-radius: 6px;
  border: 1px solid rgb(0 0 0 / 20%);
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
}
.shareBox h1 {
  font-size: xx-large;
  margin: 0;
  color: #05348b;
}
.progress {
  height: 75px;
  padding: 10px 30px;
  border-radius: 6px;
  border: 1px solid rgb(0 0 0 / 20%);
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
}
.progress h1 {
  font-size: x-large;
  color: #05348b;
  line-height: 50px;
  float: left;
}
.button {
  height: 50px;
  width: 320px;
  padding: 10px 30px;
  border-radius: 6px;
  border: 1px solid rgb(0 0 0 / 20%);
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
}
</style>
