<template>
  <div class="gutter-example">
    <div class="listTop">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>我的分享</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-row :gutter="[18, 10]" class="list">
      <a-col class="gutter-row" v-for="share in state.shares" :key="share.id">
        <div class="gutter-box">
          <div class="shareBox">
            <div class="shareBoxTop">
              <picture-two-tone v-if="share.type == 'photo'" />
              <camera-two-tone v-if="share.type == 'video'" />
              <customer-service-two-tone v-if="share.type == 'audio'" />
              <file-word-two-tone v-if="share.type == 'text'" />
              <div style="margin-left: 10px">
                <h3>{{ share.name }}</h3>
                <h5>到期时间: {{ share.expireFormat }}</h5>
              </div>
            </div>
            <a-divider style="margin: 6px 0" />
            <div class="shareBoxButtom">
              <file-outlined @click="copyUrl(share.id)" />
              <delete-outlined @click="daleteShare(share.id)" />
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import {
  PictureTwoTone,
  CustomerServiceTwoTone,
  FileOutlined,
  FileWordTwoTone,
  CameraTwoTone,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { defineComponent, reactive, onBeforeMount } from "vue";
import { Share } from "../interface";
import api from "../api/api";
import store from "../store";
interface state {
  shares: Share[];
}
export default defineComponent({
  name: "ShareList",
  components: {
    FileOutlined,
    PictureTwoTone,
    CustomerServiceTwoTone,
    FileWordTwoTone,
    CameraTwoTone,
    DeleteOutlined,
  },
  setup() {
    const state = reactive<state>({
      shares: [],
    });

    onBeforeMount(() => {
      api.getShareUrlAll().then((res: any) => {
        if (res.code == 200) {
          store.commit("setUser", res.data.user);
          state.shares = res.data.shares;
          state.shares.forEach((value: Share) => {
            let index = value.expire?.lastIndexOf("T");
            let index2 = value.expire?.lastIndexOf(".");
            value.expireFormat =
              value.expire?.slice(0, index) +
              " " +
              value.expire?.slice(index! + 1, index2);
          });
        }
      });
    });

    function copyUrl(id: any) {
      message.success("已复制到剪贴板");
      navigator.clipboard.writeText(
        `http://127.0.0.1:5173/share/xq${store.state.user?.id}_${id}`
      );
    }

    function daleteShare(id: any) {
      api.removeShareUrl({ id: id }).then((res: any) => {
        if (res.code == 200) {
          console.log(res.data);
        }
      });
    }

    return {
      state,
      copyUrl,
      daleteShare,
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
  height: 125px;
  width: 300px;
  padding: 10px 30px;
  border-radius: 6px;
  border: 1px solid rgb(0 0 0 / 20%);
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
}

.shareBoxTop {
  display: flex;
  align-items: center;
}
.shareBoxTop >>> svg {
  width: 2.5em;
  height: 2.5em;
}
.shareBoxButtom {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.shareBoxButtom >>> svg {
  width: 1.5em;
  height: 1.5em;
  margin-left: 10px;
}
</style>
