<template>
  <a-menu class="default-menu">
    <a-menu-item :key="item.key" v-for="item in menuOptions">
      <DefaultIcon :name="item.icon" size="25px"></DefaultIcon>
      <span class="menu-item-text">
        {{ item.name }}
      </span>
    </a-menu-item>
  </a-menu>
</template>

<script setup lang="ts">
import DefaultIcon from "@/components/general/icons/DefaultIcon.vue";

interface IMenuItem {
  key: string;
  icon: string;
  name: string;
}

interface Props {
  menuOptions: IMenuItem[];
  collapsed: boolean;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.menu-item-text {
  margin-left: 18px;

  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
</style>
