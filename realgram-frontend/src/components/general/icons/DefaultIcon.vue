<template>
  <i
    class="default-icon"
    :class="[name, { '--pointer': pointer }]"
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
  pointer: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.default-icon {
  width: min-content;
  height: min-content;

  &.--pointer {
    cursor: pointer;
  }
}
</style>
