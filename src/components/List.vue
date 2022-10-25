<template>
  <div class="gutter-example">
    <a-row :gutter="[18, 10]">
      <a-col class="gutter-row" v-for="file in state.files" :key="file.id">
        <div class="gutter-box">
          <Fileblock :file="file" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onBeforeMount, provide } from "vue";
import api from "../api/api";
import store from "../store";
import { File } from "../interface";
import Fileblock from "../components/Fileblock.vue";
interface state {
  files: File[] | undefined;
}
export default defineComponent({
  name: "List",
  components: {
    Fileblock,
  },
  setup() {
    const state = reactive<state>({
      files: undefined,
    });

    onBeforeMount(() => {
      api.home().then((res: any) => {
        if (res.code == 200) {
          store.commit("setUser", res.data.user);
          state.files = res.data.files;
        } else {
          console.log(res);
        }
      });
    });

    provide("file", state.files);

    return {
      state,
    };
  },
});
</script>

<style scoped>
.gutter-example :deep(.ant-row > div) {
  background: transparent;
  border: 0;
}
.gutter-box {
  border: 1px solid brown;
  padding: 5px 0;
}
</style>
