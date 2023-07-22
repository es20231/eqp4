<template>
  <a-config-provider :theme="DefaultTheme">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import DefaultTheme from "@/theme/_theme.json";
</script>

<style lang="scss"></style>
