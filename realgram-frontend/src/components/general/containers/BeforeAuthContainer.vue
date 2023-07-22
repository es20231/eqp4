<template>
  <main class="before-auth-container">
    <slot></slot>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.before-auth-container {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  background-color: $white;
}
</style>
