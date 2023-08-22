<template>
  <a-modal
    size="large"
    :width="350"
    title="Seguidores"
    class="show-user-followers-modal"
    :footer="false"
  >
    <div class="modal__content">
      <!-- Search -->
      <DefaultInput
        v-model="inputFilter"
        placeholder="Pesquisar"
      ></DefaultInput>

      <!-- No Content -->
      <div class="content_no-data" v-if="followersList.length == 0">
        <span> Lista de seguidores vazia. </span>
      </div>

      <!-- List -->
      <div class="containe__user-list" v-else>
        <!-- Item -->
        <template :key="user._id" v-for="user in filteredList">
          <div class="user-list__item">
            <a-avatar
              :size="38"
              :src="
                user.profilePhoto
                  ? apiRootURL + '/uploads/' + user.profilePhoto
                  : require('@/assets/imgs/default-avatar.png')
              "
            />

            <span class="data__title" @click="handleUserClick(user)">{{
              user.username
            }}</span>

            <!-- <div class="item__btn">
              <DefaultButton
                :loading="followIsLoading"
                @click="handleFollowClick(user)"
                :type="
                  authUser.following.map((user) => user._id).includes(user._id)
                    ? 'default'
                    : 'primary'
                "
                >{{
                  authUser.following.map((user) => user._id).includes(user._id)
                    ? "Seguindo"
                    : "Seguir"
                }}</DefaultButton
              >
            </div> -->
          </div>
        </template>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import IUserData from "@/interfaces/IUserData";
// import DefaultButton from "@/components/general/buttons/DefaultButton.vue";
import DefaultInput from "@/components/general/inputs/DefaultInput.vue";
// import CacheManager from "@/utils/CacheManager";
import { useRouter } from "vue-router";

interface Props {
  user: IUserData | null;
}

const props = defineProps<Props>();

const emit = defineEmits(["close"]);

onMounted(() => {
  if (props.user) fillFollowersList(props.user.followers);
});

const router = useRouter();
const inputFilter = ref<string>("");
const followersList = ref<IUserData[]>([]);
// const followIsLoading = ref<boolean>(false);
const apiRootURL = ref(process.env.VUE_APP_API_ROOT);

// const authUser = computed((): IUserData => {
//   return CacheManager.get("__user");
// });
const filteredList = computed(() => {
  return followersList.value.filter(
    (user) =>
      user.username
        .toLocaleLowerCase()
        .includes(inputFilter.value.toLocaleLowerCase()) ||
      user.name
        .toLocaleLowerCase()
        .includes(inputFilter.value.toLocaleLowerCase())
  );
});

function fillFollowersList(list: IUserData[] | null) {
  if (list == null) return;
  followersList.value = list;
}

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

// function handleFollowClick(user: IUserData) {
//   console.log("Handle Follow Click", user);
// }
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.show-user-followers-modal {
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
      width: 100%;
      max-height: 60vh;
      padding: 0 10px;
      margin: 15px 0px;

      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .user-list__item {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 15px;

        span {
          font-size: 14px;
          font-weight: 600;
          max-width: 180px;

          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }

        .item__btn {
          margin-left: auto;
        }
      }
    }
  }
}
</style>
