<template>
  <div class="loading-screen" v-if="loading">
    <div class="loader"></div>
    <p>Carregando...</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.loading-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  z-index: 9999;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.3);
  border-top: 4px solid #262626;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

p {
  margin-top: 10px;
  color: #262626;
  font-weight: bold;
}
</style>
