<template>
  <a-layout style="min-height: 100vh" class="dashboard-view">
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

      <!-- Search Drawer -->
      <SearchDrawer v-model:open="searchDrawer.visible" />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import DefaultLogo from "@/components/general/icons/DefaultLogo.vue";
import DefaultMenu from "@/components/general/menus/DefaultMenu.vue";
import SearchDrawer from "@/components/general/drawers/SearchDrawer.vue";

import { ref, onMounted, reactive } from "vue";
import router from "@/router";
import SendNotification from "@/utils/SendNotification";
import AuthService from "@/services/AuthService";
import CacheManager from "@/utils/CacheManager";
import IUserData from "@/interfaces/IUserData";

onMounted(() => {
  selectedKeys.value = [findMenuFromURL()];
});

const loggoutIsLoading = ref(false);
const menuCollapsed = ref(false);
const selectedKeys = ref(["/"]);
const dashboardMenu = ref([
  {
    key: "/",
    name: "Página inicial",
    icon: "ri-home-2-line",
  },
  {
    key: "search",
    name: "Pesquisar",
    icon: "ri-search-line",
  },
  {
    key: "upload-image",
    name: "Salvar",
    icon: "ri-image-add-line",
  },
  {
    key: "new-post",
    name: "Postar",
    icon: "ri-add-box-line",
  },
  {
    key: "profile",
    name: "Perfil",
    icon: "ri-user-line",
  },
  {
    key: "loggout",
    name: "Sair",
    icon: "ri-logout-box-line",
  },
]);
const searchDrawer = reactive({
  visible: false,
  open: () => {
    searchDrawer.visible = true;
  },
  close: () => {
    searchDrawer.visible = false;
  },
});

function handleMenuClick(event: { item: any; key: string; keyPath: string }) {
  const { key } = event;
  const currentUser: IUserData = CacheManager.get("__user");

  switch (key) {
    case "/":
      router.push({ name: "timeline" });
      break;
    case "search":
      searchDrawer.open();
      break;
    case "upload-image":
      SendNotification("info", {
        duration: 3,
        placement: "bottomRight",
        message: "Em construção...",
      });
      break;
    case "new-post":
      SendNotification("info", {
        duration: 3,
        placement: "bottomRight",
        message: "Em construção...",
      });
      break;
    case "profile":
      router.push({
        name: "profile",
        params: {
          username: currentUser.username,
        },
      });
      break;
    case "loggout":
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
      CacheManager.delete("__user");

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

function findMenuFromURL(): string {
  const url = window.location.href;
  const dashboardIndex = url.indexOf("/dashboard/");
  const subRoute = url
    .slice(dashboardIndex + "/dashboard/".length)
    .split("/")[0];

  console.log(url);
  console.log(dashboardIndex);
  console.log(subRoute);

  if (subRoute === "") return "/";
  else return subRoute;
}
</script>

<style scoped lang="scss">
.dashboard-view {
  .view__side-menu {
    .side-menu__container {
      height: 100%;

      display: flex;
      flex-direction: column;
      gap: 20px;

      border-inline-end: 2px solid rgba(5, 5, 5, 0.08);

      .container__header {
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
