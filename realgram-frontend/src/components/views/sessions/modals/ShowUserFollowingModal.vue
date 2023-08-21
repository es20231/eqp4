<template>
  <a-modal
    size="large"
    :width="300"
    title="Seguidores"
    class="show-user-following-modal"
    :footer="false"
  >
    <div class="modal__content">
      <!-- Search -->
      <DefaultInput
        v-model="inputFilter"
        placeholder="Pesquisar"
      ></DefaultInput>

      <!-- No Content -->
      <div class="content_no-data" v-if="followingList.length == 0">
        <span> Lista de seguindo vazia. </span>
      </div>

      <!-- List -->
      <div class="containe__user-list" v-else>
        <!-- Item -->
        <template :key="user._id" v-for="user in filteredList">
          <div class="user-list__item" @click="handleUserClick(user)">
            <a-avatar
              :size="38"
              :src="
                user.profilePhoto
                  ? user.profilePhoto
                  : require('@/assets/imgs/default-avatar.png')
              "
            />

            <div class="item__data">
              <span class="data__title">{{ user.username }}</span>
              <span class="data__subtitle">{{ user.name }}</span>
            </div>

            <div class="item__btn">
              <DefaultButton
                :loading="followIsLoading"
                @click="handleFollowClick(user)"
                :type="authUserFollowThisUser(user) ? 'default' : 'primary'"
                >{{
                  authUserFollowThisUser(user) ? "Seguindo" : "Seguir"
                }}</DefaultButton
              >
            </div>
          </div>
        </template>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import IUserData from "@/interfaces/IUserData";
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";
import DefaultInput from "@/components/general/inputs/DefaultInput.vue";
import CacheManager from "@/utils/CacheManager";
import UserService from "@/services/UserService";
import SendNotification from "@/utils/SendNotification";
import { useRouter } from "vue-router";

interface Props {
  username: string;
}

const props = defineProps<Props>();

const emit = defineEmits(["close"]);

onMounted(() => {
  fetchUserFollowing();
});

const router = useRouter();
const inputFilter = ref<string>("");
const followingList = ref<IUserData[]>([]);
const listIsLoading = ref<boolean>(false);
const followIsLoading = ref<boolean>(false);

const authUser = computed((): IUserData => {
  return CacheManager.get("__user");
});
const filteredList = computed(() => {
  return followingList.value.filter(
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
  console.log("Handle User Click", user);

  emit("close");

  router.push({
    name: "profile",
    params: {
      username: user.username,
    },
  });
}

function handleFollowClick(user: IUserData) {
  console.log("Handle Follow Click", user);
}

function authUserFollowThisUser(user: IUserData) {
  let follow = false;

  authUser.value?.following?.forEach((follower: string) => {
    if (follower == user._id) follow = true;
  });

  return follow;
}

async function fetchUserFollowing() {
  listIsLoading.value = true;

  await UserService.getUserFollowing(props.username)
    .then((response) => {
      console.log("Get User Following", response);

      followingList.value = response.data;
    })
    .catch((error) => {
      console.log("Get User Following Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message: "Erro interno ao resgatar lista de seguindo, tente novamente",
      });
    });

  listIsLoading.value = false;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.show-user-following-modal {
  .modal__content {
    .content_no-data {
      width: 100%;
      margin-top: 20px;
      text-align: center;

      span {
        font-size: 15px;
        font-weight: 500;

        color: $placeholder-color;
      }
    }
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
