<template>
  <main class="before-auth-card" :class="[`--padding-${padding}`]">
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
defineProps({
  padding: {
    type: String,
    default: "normal",
  },
});
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.before-auth-card {
  &.--padding-small {
    padding: 18px 24px 24px 18px;
  }
  &.--padding-normal {
    padding: 24px 12px 32px 24px;
  }
  &.--padding-large {
    padding: 48px 26px 56px 26px;
  }

  border: 1px solid #0000004d;
  background: transparent;
}
</style>
