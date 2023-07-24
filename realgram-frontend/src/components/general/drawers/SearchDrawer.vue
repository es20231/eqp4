<template>
  <a-drawer
    closable
    keyboard
    title="Pesquisa"
    placement="left"
    class="search-drawer"
  >
    <div class="drawer__container">
      <!-- Search -->
      <DefaultInput
        v-model="inputFilter"
        placeholder="Pesquisar"
      ></DefaultInput>

      <!-- List -->
      <div class="containe__user-list">
        <!-- Item -->
        <template :key="user._id" v-for="user in filteredList">
          <div class="user-list__item" @click="handleUserClick(user)">
            <a-avatar
              :size="38"
              :src="
                user.profileImage
                  ? user.profileImage
                  : require('@/assets/imgs/default-avatar.png')
              "
            />
            <div class="item__data">
              <span class="data__title">{{ user.username }}</span>
              <span class="data__subtitle">{{ user.name }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import DefaultInput from "@/components/general/inputs/DefaultInput.vue";

import { ref, onMounted, computed } from "vue";
import IUserData from "@/interfaces/IUserData";
import UserService from "@/services/UserService";
import SendNotification from "@/utils/SendNotification";
import { useRouter } from "vue-router";

const emit = defineEmits(["close"]);

onMounted(() => {
  fetchUserList();
});

const router = useRouter();
const inputFilter = ref("");
const userList = ref<IUserData[]>([]);
const userListIsLoading = ref(false);

const filteredList = computed(() => {
  return userList.value.filter(
    (user) =>
      user.username
        .toLocaleLowerCase()
        .includes(inputFilter.value.toLocaleLowerCase()) ||
      user.name
        .toLocaleLowerCase()
        .includes(inputFilter.value.toLocaleLowerCase())
  );
});

function handleUserClick(user: IUserData) {
  console.log("Handle Search User Click");

  emit("close");

  router.push({
    name: "profile",
    params: {
      username: user.username,
    },
  });
}

async function fetchUserList() {
  console.log("Fetch User List");

  userListIsLoading.value = true;

  await UserService.getAllUser()
    .then((response) => {
      console.log("Fetch User List Successful: ", response);
      userList.value = response.data;
    })
    .catch((error) => {
      console.log("Fetch User List Error: ", error);

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
          message:
            "Erro interno ao pesquisar lista de usuários, tente novamente.",
        });
      }
    });

  userListIsLoading.value = false;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.search-drawer {
  .drawer__container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .containe__user-list {
      max-height: 75vh;

      padding: 0px 16px 0px 8px;

      overflow: auto;
      scrollbar-width: thin !important;
      scrollbar-color: #888 #f5f5f5 !important;

      &::-webkit-scrollbar {
        width: 6px !important;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #888 !important;
        border-radius: 3px !important;
      }

      &::-webkit-scrollbar-track {
        background-color: #f5f5f5 !important;
        border-radius: 3px !important;
      }

      .user-list__item {
        width: 100%;
        padding: 6px 8px;

        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        border-radius: 10px;
        &:hover {
          background-color: #ccc;
          transform: scale(1.02);
        }

        display: flex;
        align-items: center;
        justify-content: flex-start;

        gap: 10px;
        margin-bottom: 10px;

        .item__data {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;

          .data__title {
            font-size: 14px;
            font-weight: 600;
          }

          .data__subtitle {
            font-size: 15px;
            font-weight: 500;

            color: $placeholder-color;
          }
        }
      }
    }
  }
}
</style>
