<template>
  <div class="gutter-example">
    <div class="listTop">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>{{ path }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div style="margin: 16px 0; flex: 1; text-align: right">
        <appstore-outlined @click="updataIsFileSort" />
      </div>
    </div>
    <div v-if="isFileSort != 3" class="list">
      <a-row :gutter="[18, 10]">
        <a-col class="gutter-row" v-for="file in state.files" :key="file.id">
          <div class="gutter-box">
            <Fileblock :file="file" />
          </div>
        </a-col>
      </a-row>
    </div>
    <div v-if="isFileSort == 3">
      <div v-for="file in state.files" :key="file.id">
        <FileLine :file="file" />
      </div>
    </div>
  </div>
  <AudioFixed v-if="isAudioFixed" />
  <TextFixed v-if="isTextFixed" />
</template>

<script lang="ts">
import { AppstoreOutlined } from "@ant-design/icons-vue";
import {
  defineComponent,
  reactive,
  onBeforeMount,
  computed,
  onUpdated,
} from "vue";
import api from "../api/api";
import store from "../store";
import router from "../router";
import { useRoute } from "vue-router";
import { File } from "../interface";
import Fileblock from "./Fileblock.vue";
import FileLine from "./FileLine.vue";
import AudioFixed from "./AudioFixed.vue";
import TextFixed from "./TextFixed.vue";
interface state {
  files: File[];
}
export default defineComponent({
  name: "TypeList",
  components: {
    AudioFixed,
    TextFixed,
    Fileblock,
    FileLine,
    AppstoreOutlined,
  },
  setup() {
    const state = reactive<state>({
      files: [],
    });

    const route = useRoute();

    onBeforeMount(() => {
      api
        .getFileListByType({
          page: 1,
          rows: 20,
          type: route.params.type,
        })
        .then((res: any) => {
          if (res.code == 200) {
            store.commit("setUser", res.data.user);
            state.files = res.data.files;
          } else {
            store.commit("setToken", "");
            router.push("/login");
          }
        });
    });

    onUpdated(() => {
      api
        .getFileListByType({
          page: 1,
          rows: 20,
          type: route.params.type,
        })
        .then((res: any) => {
          if (res.code == 200) {
            store.commit("setUser", res.data.user);
            state.files = res.data.files;
          }
        });
    });

    function updataIsFileSort() {
      store.commit("updataIsFileSort");
    }

    return {
      state,
      isFileSort: computed(() => store.state.isFileSort),
      isAudioFixed: computed(() => store.state.isAudioFixed),
      isTextFixed: computed(() => store.state.isTextFixed),
      path: computed(() => route.params.type),
      listStyle: {
        padding: "0 24px",
      },
      listStyle2: {
        padding: "0",
      },
      updataIsFileSort,
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
}
</style>
