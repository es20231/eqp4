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
          @click="handleMenuClick"
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
import DefaultLogo from "@/components/general/icons/DefaultLogo.vue";
import DefaultMenu from "@/components/general/menus/DefaultMenu.vue";

import { ref } from "vue";
import router from "@/router";
import SendNotification from "@/utils/SendNotification";
import AuthService from "@/services/AuthService";
import CacheManager from "@/utils/CacheManager";

const loggoutIsLoading = ref(false);
const menuCollapsed = ref(false);
const selectedKeys = ref([0]);
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

function handleMenuClick(event: { item: any; key: number; keyPath: string }) {
  console.log("Handle Menu Click", event);
  const { key } = event;

  switch (key) {
    case 0:
      router.push({ name: "timeline" });
      break;
    case 1:
      SendNotification("info", {
        duration: 3,
        placement: "bottomRight",
        message: "Em construção...",
      });

      break;
    case 2:
      SendNotification("info", {
        duration: 3,
        placement: "bottomRight",
        message: "Em construção...",
      });
      break;
    case 3:
      SendNotification("info", {
        duration: 3,
        placement: "bottomRight",
        message: "Em construção...",
      });
      break;
    case 4:
      loggoutUser();
      break;
  }
}

async function loggoutUser() {
  console.log("Handle Loggout Click");

  loggoutIsLoading.value = true;

  await AuthService.logout()
    .then((response) => {
      console.log("Loggout Successful: ", response);

      CacheManager.delete("__token");

      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("Loggout Error: ", error);

      if (error.response) {
        SendNotification("error", {
          duration: 3,
          placement: "bottomRight",
          message: error.response.data.error,
        });
      } else {
        SendNotification("error", {
          duration: 3,
          placement: "bottomRight",
          message: "Erro interno ao realizar logout, tente novamente.",
        });
      }
    });

  loggoutIsLoading.value = false;
}
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
