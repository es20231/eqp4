<template>
  <i
    class="default-icon"
    :class="name"
    :style="{
      fontSize: size,
      color: color,
    }"
  ></i>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: String,
    default: "14px",
  },
  color: {
    type: String,
    default: "black",
  },
  name: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.default-icon {
  width: min-content;
  height: min-content;
}
</style>
