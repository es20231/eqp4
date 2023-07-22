<template>
  <a-layout style="min-height: 100vh">
    <!-- Side Menu -->
    <a-layout-sider
      collapsible
      theme="light"
      :width="280"
      class="view__side-menu"
      v-model:collapsed="menuCollapsed"
    >
      <div class="side-menu__container">
        <!-- Logo -->
        <div class="container__header">
          <img v-if="menuCollapsed" src="@/assets/svg/realgram-icon.svg" />
          <DefaultLogo v-else />
        </div>

        <!-- Menu -->
        <DefaultMenu
          mode="inline"
          :collapsed="menuCollapsed"
          :menuOptions="dashboardMenu"
          v-model:selectedKeys="selectedKeys"
        >
        </DefaultMenu>
      </div>
    </a-layout-sider>
    <!-- Main -->
    <a-layout>
      <router-view />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DefaultLogo from "@/components/general/icons/DefaultLogo.vue";
import DefaultMenu from "@/components/general/menus/DefaultMenu.vue";

const menuCollapsed = ref(false);
const selectedKeys = ref([]);
const dashboardMenu = ref([
  {
    name: "Página Inicial",
    icon: "ri-home-2-line",
  },
  {
    name: "Pesquisa",
    icon: "ri-search-line",
  },
  {
    name: "Criar",
    icon: "ri-add-box-line",
  },
  {
    name: "Perfil",
    icon: "ri-user-line",
  },
  {
    name: "Sair",
    icon: "ri-logout-box-line",
  },
]);
</script>

<style scoped lang="scss">
.view__side-menu {
  .side-menu__container {
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 20px;

    border-inline-end: 1px solid rgba(5, 5, 5, 0.06);

    .container__header {
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
