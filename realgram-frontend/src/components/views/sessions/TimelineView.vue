<template>
  <div class="timeline-view">
    <div class="no-post-message">
      <h1 class="view__title">Bem-vindo à sua timeline</h1>
      <span class="view__subtitle">
        Ela está vazia, mas não por muito tempo.
        <br />
        Comece a seguir outras pessoas para que suas postagens apareçam
        aqui.</span
      >

      <DefaultButton
        size="large"
        shape="round"
        type="primary"
        @click="handleStartPostClick"
        >Comece agora mesmo</DefaultButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";

import { ref } from "vue";

const showSearchSidebar = ref(false);
function handleStartPostClick() {
  console.log("Handle Start Post Click");

  showSearchSidebar.value = true;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.timeline-view {
  width: 100%;
  height: 100vh;

  .no-post-message {
    width: max-content;
    max-width: 380px;
    height: 100%;
    margin: auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 12px;

    .view__title {
      font-size: 22px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;

      color: $title-color;
    }

    .view__subtitle {
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;

      text-align: center;

      color: $subtitle-color;

      margin-bottom: 20px;
    }
  }
}
</style>
