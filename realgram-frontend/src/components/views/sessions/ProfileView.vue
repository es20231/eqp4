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
      @update="editUserModal.update()"
      v-model:open="editUserModal.visible"
    />
    <ShowUserFollowersModal
      :username="followersModal.username"
      v-if="followersModal.visible"
      @close="followersModal.close()"
      @cancel="followersModal.close()"
      @update="followersModal.update()"
      v-model:open="followersModal.visible"
    />
    <ShowUserFollowingModal
      :username="followingModal.username"
      v-if="followingModal.visible"
      @close="followingModal.close()"
      @cancel="followingModal.close()"
      @update="followingModal.update()"
      v-model:open="followingModal.visible"
    />

    <!-- Content -->
    <div class="profile-view__content" v-if="!userIsLoading">
      <!-- Header -->
      <div class="profile-view__header">
        <img
          alt="Foto do usuário"
          class="header__user-image"
          :src="
            userData?.profilePhoto
              ? apiRootURL + '/uploads/' + userData.profilePhoto
              : require('@/assets/imgs/default-avatar.png')
          "
        />

        <div class="header__content">
          <div class="content__row">
            <!-- User @ -->
            <span class="content__username"> {{ userData?.username }} </span>
            <!-- Edit Profile -->
            <DefaultButton v-if="isAuthProfile" @click="editUserModal.open()"
              >Editar perfil</DefaultButton
            >
            <!-- Follow/Unfollow -->
            <DefaultButton
              v-if="!isAuthProfile"
              :loading="followIsLoading"
              @click="handleFollowClick"
              :type="authFollowThisUser == true ? 'default' : 'primary'"
              >{{
                authFollowThisUser == true ? "Seguindo" : "Seguir"
              }}</DefaultButton
            >
          </div>

          <div class="content__row">
            <span class="content__pub-counter">
              {{ `${userData?.posts?.length} publicações` }}
            </span>
            <span
              class="content__pub-counter --pointer"
              @click="followersModal.open(userData?.username)"
            >
              {{ `${userData?.followers?.length} seguidores` }}
            </span>
            <span
              class="content__pub-counter --pointer"
              @click="followingModal.open(userData?.username)"
            >
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

      <!-- Body -->
      <div class="profile-view__images-container">
        <a-tabs v-model:activeKey="activeTab" centered>
          <a-tab-pane key="library-tab" tab="Biblioteca" v-if="isAuthProfile">
            <UserLibraryTable
              :library="userData?.library"
              @update="fetchUserData()"
            ></UserLibraryTable>
          </a-tab-pane>

          <a-tab-pane key="posts-tab" tab="Postagens">
            <UserPostsTable
              :user="userData"
              :posts="userData?.posts"
              @update="fetchUserData()"
              :isAuthUserProfile="isAuthProfile"
            ></UserPostsTable>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";
import EditProfileModal from "@/components/views/sessions/modals/EditProfileModal.vue";
import LoadingScreen from "@/components/general/loading/LoadingScreen.vue";
import UserLibraryTable from "@/components/general/tables/UserLibraryTable.vue";
import UserPostsTable from "@/components/general/tables/UserPostsTable.vue";

import { ref, reactive, onMounted, watch, computed } from "vue";
import IUserData from "@/interfaces/IUserData";
import UserService from "@/services/UserService";
import CacheManager from "@/utils/CacheManager";
import SendNotification from "@/utils/SendNotification";
import ShowUserFollowersModal from "./modals/ShowUserFollowersModal.vue";
import ShowUserFollowingModal from "./modals/ShowUserFollowingModal.vue";

interface Props {
  username: string;
}

const props = defineProps<Props>();

onMounted(async () => {
  await fetchUserData();
  if (!isAuthProfile.value) {
    activeTab.value = "posts-tab";
  }
});

const userData = ref<any>();
const userIsLoading = ref(true);
const followIsLoading = ref(false);
const activeTab = ref<string>("library-tab");
const apiRootURL = ref(process.env.VUE_APP_API_ROOT);

const authUser = computed((): IUserData => {
  return CacheManager.get("__user");
});
const isAuthProfile = computed((): boolean => {
  return authUser.value?._id == userData.value?._id;
});
const authFollowThisUser = computed(() => {
  let follow = false;

  userData.value?.followers?.forEach((follower: string) => {
    if (follower == authUser.value._id) follow = true;
  });

  return follow;
});

const followersModal = reactive({
  username: "",
  visible: false,
  open: (username: string) => {
    followersModal.visible = true;
    followersModal.username = username;
  },
  close: () => {
    followersModal.username = "";
    followersModal.visible = false;
  },
  update: () => {
    followersModal.close();
    fetchUserData();
  },
});
const followingModal = reactive({
  username: "",
  visible: false,
  open: (username: string) => {
    followingModal.visible = true;
    followingModal.username = username;
  },
  close: () => {
    followingModal.username = "";
    followingModal.visible = false;
  },
  update: () => {
    followingModal.close();
    fetchUserData();
  },
});
const editUserModal = reactive({
  visible: false,
  open: () => {
    editUserModal.visible = true;
  },
  close: () => {
    editUserModal.visible = false;
  },
  update: () => {
    editUserModal.close();
    fetchUserData();
  },
});

watch(props, () => {
  fetchUserData();
});

function handleFollowClick() {
  console.log("Handle Follow Click", authFollowThisUser.value);

  if (authFollowThisUser.value == false) {
    followUser();
  } else {
    unfollowUser();
  }
}

async function followUser() {
  followIsLoading.value = true;

  const userID = userData.value._id;
  await UserService.followUser(userID)
    .then((response) => {
      console.log("Follow User", response);

      fetchUserData();
    })
    .catch((error) => {
      console.log("Follow User Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message: "Erro interno ao seguir usuário, tente novamente",
      });
    });

  followIsLoading.value = false;
}

async function unfollowUser() {
  followIsLoading.value = true;

  const userID = userData.value._id;
  await UserService.unfollowUser(userID)
    .then((response) => {
      console.log("Unfollow User", response);

      fetchUserData();
    })
    .catch((error) => {
      console.log("Unfollow User Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message: "Erro interno ao desseguir usuário, tente novamente",
      });
    });

  followIsLoading.value = false;
}

async function fetchUserData() {
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
  min-height: 100vh;

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

        &.--pointer {
          cursor: pointer;
        }
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
}
</style>
