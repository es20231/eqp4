<template>
  <div class="profile-view">
    <!-- Screens -->
    <LoadingScreen :loading="userIsLoading"></LoadingScreen>

    <!-- Modals -->
    <EditProfileModal
      :userData="userData"
      v-if="editUserModal.visible"
      @close="editUserModal.close()"
      @cancel="editUserModal.close()"
      v-model:open="editUserModal.visible"
    />

    <!-- Content -->
    <div class="profile-view__content">
      <div class="profile-view__header">
        <img
          alt="Foto do usuário"
          class="header__user-image"
          :src="
            userData?.profileImage
              ? userData.profileImage
              : require('@/assets/imgs/default-avatar.png')
          "
        />
        <div class="header__content">
          <div class="content__row">
            <span class="content__username"> {{ userData?.username }} </span>
            <DefaultButton @click="editUserModal.open()"
              >Editar perfil</DefaultButton
            >
          </div>

          <div class="content__row">
            <span class="content__pub-counter">
              {{ `${userData?.posts?.length} publicações` }}
            </span>
            <span class="content__pub-counter">
              {{ `${userData?.followers?.length} seguidores` }}
            </span>
            <span class="content__pub-counter">
              {{ `${userData?.following?.length} seguindo` }}
            </span>
          </div>

          <div class="content__column">
            <span class="content__name"> {{ userData?.name }} </span>
            <span class="content__description">
              {{ userData?.description }}
            </span>
          </div>
        </div>
      </div>

      <div class="profile-view__images-container">
        <a-tabs v-model:activeKey="activeTab" centered>
          <a-tab-pane key="library-tab" tab="Biblioteca">
            <!-- Image Paginated Table -->
            <div class="image-table">
              <img
                :key="item._id"
                :src="item.image"
                class="table__img"
                v-for="item in userData?.library"
                alt="Imagem da biblioteca do usuário"
              />
            </div>
          </a-tab-pane>
          <a-tab-pane key="posts-tab" tab="Postagens">Post Tab</a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";
import EditProfileModal from "@/components/views/sessions/modals/EditProfileModal.vue";
import LoadingScreen from "@/components/general/loading/LoadingScreen.vue";

import { ref, reactive, onMounted } from "vue";
import UserService from "@/services/UserService";
import SendNotification from "@/utils/SendNotification";

interface Props {
  username: string;
}

const props = defineProps<Props>();

onMounted(() => {
  fetchUserData();
});

const userIsLoading = ref(false);
const userData = ref<any>();
const activeTab = ref<string>("library-tab");
const editUserModal = reactive({
  visible: false,
  open: () => {
    editUserModal.visible = true;
  },
  close: () => {
    editUserModal.visible = false;
  },
});

async function fetchUserData() {
  userIsLoading.value = true;

  await UserService.getUserByUsername(props.username)
    .then((response) => {
      console.log("Fetch User Data", response);
      userData.value = response.data;
    })
    .catch((error) => {
      console.log("Fetch User Data Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message: "Erro interno ao resgatar dados do usuário, tente novamente",
      });
    });

  userIsLoading.value = false;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.profile-view {
  width: 100%;
  height: 100vh;

  padding: 30px 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .profile-view__content {
    max-width: 850px;
    width: 80%;
  }

  .profile-view__header {
    width: 100%;
    padding-bottom: 20px;

    display: flex;
    flex-direction: row;

    justify-content: flex-start;

    gap: 25px;

    .header__user-image {
      min-width: 150px;
      height: 150px;

      border-radius: 50%;
      padding: 2px;
      border: 1px solid $black;
    }

    .header__content {
      width: 100%;

      display: flex;
      flex-direction: column;

      align-items: flex-start;
      justify-content: flex-start;
      gap: 20px;

      .content__row {
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 40px;
      }
      .content__column {
        width: 100%;
        flex-direction: column;

        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 2px;
      }

      .content__username {
        font-size: 20px;
        font-weight: 400;
      }

      .content__pub-counter {
        font-size: 16px;
        font-weight: 400;
      }

      .content__name {
        font-size: 14px;
        font-weight: 400;
      }

      .content__description {
        max-width: 70%;

        font-size: 14px;
        font-weight: 400;
      }
    }
  }

  .image-table {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;

    .table__img {
      width: 270px;
      height: 320px;

      object-fit: cover;
    }
  }
}
</style>
