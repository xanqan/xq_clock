<template>
  <h1>Favorites</h1>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import store from "../store";
interface state {}
export default defineComponent({
  name: "Favorites",
  setup() {
    const state = reactive<state>({});

    console.log(store.state.user);

    return {
      state,
    };
  },
});
</script>

<style scoped></style>
