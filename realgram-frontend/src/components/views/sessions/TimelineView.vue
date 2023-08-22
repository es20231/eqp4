<template>
  <div class="timeline-view">
    <!-- Modals -->
    <PostCommentsModal
      :post="postCommentModal.post"
      v-if="postCommentModal.visible"
      @close="postCommentModal.close()"
      @cancel="postCommentModal.close()"
      @update="postCommentModal.update()"
      v-model:open="postCommentModal.visible"
    />
    <PostInterationsModal
      :post="postInterationsModal.post"
      v-if="postInterationsModal.visible"
      @close="postInterationsModal.close()"
      @cancel="postInterationsModal.close()"
      v-model:open="postInterationsModal.visible"
    />

    <!-- Screens -->
    <LoadingScreen :loading="timelineIsLoading"></LoadingScreen>

    <!-- No Following -->
    <div class="no-post-message" v-if="authUser?.following?.length == 0">
      <h1 class="view__title">Bem-vindo à sua timeline</h1>
      <span class="view__subtitle">
        Ela está vazia, mas não por muito tempo.
        <br />
        Comece a seguir outras pessoas para que suas postagens apareçam
        aqui.</span
      >

      <DefaultButton
        size="large"
        shape="round"
        type="primary"
        @click="$emit('showSearchDrawer')"
        >Comece agora mesmo</DefaultButton
      >
    </div>

    <!-- No Post -->
    <div class="no-post-message" v-if="timeline?.length == 0">
      <h1 class="view__title">Sua linha do tempo está vazia</h1>
      <span class="view__subtitle">
        Aguarde seus amigos começarem a compartilhar suas experiências ou crie
        você mesmo sua postagem.
      </span>

      <DefaultButton
        size="large"
        shape="round"
        type="primary"
        @click="handleInitPostClick"
        >Criar postagem
      </DefaultButton>
    </div>

    <!-- Timeline -->
    <div class="view__timeline-container">
      <template :key="index" v-for="(post, index) in timeline">
        <div class="post-container">
          <div class="body__header">
            <a-avatar
              :size="38"
              :src="
                post.postedBy.profilePhoto
                  ? apiRootURL + '/uploads/' + post.postedBy.profilePhoto
                  : require('@/assets/imgs/default-avatar.png')
              "
            />
            <span
              class="header__username"
              @click="handleUsernameClick(post.postedBy.username)"
            >
              {{ post.postedBy.username }}
            </span>
            <span class="header__date --large">•</span>
            <span class="header__date">
              {{ howManyDaysPassed(post.createdAt) }}
            </span>
          </div>

          <div class="content__image">
            <img
              alt="Imagem a ser postada na timeline."
              :src="apiRootURL + '/uploads/' + post.photo"
            />
          </div>

          <div class="content__description">
            <span>
              <strong>{{ post.postedBy.username }}</strong>
              {{ post?.body }}
            </span>
          </div>

          <div class="body__footer">
            <div class="footer__buttons-container">
              <DefaultIcon
                pointer
                size="20px"
                :name="
                  post?.likes.map((like) => like._id).includes(authUser?._id)
                    ? 'ri-thumb-up-fill'
                    : 'ri-thumb-up-line'
                "
                @click="handleLikeClick(post._id)"
              ></DefaultIcon>
              <DefaultIcon
                pointer
                size="20px"
                :name="
                  post?.dislikes
                    .map((dislike) => dislike._id)
                    .includes(authUser?._id)
                    ? 'ri-thumb-down-fill'
                    : 'ri-thumb-down-line'
                "
                @click="handleDislikeClick(post._id)"
              ></DefaultIcon>
              <DefaultIcon
                pointer
                size="20px"
                name="ri-chat-1-line"
                @click="postCommentModal.open(post)"
              ></DefaultIcon>
            </div>

            <div class="footer__iterations">
              <span @click="postInterationsModal.open(post)">{{
                `${post.likes.length + post.dislikes.length} ${
                  post.likes.length + post.dislikes.length == 1
                    ? "interação"
                    : "interações"
                } com a postagem`
              }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";
import LoadingScreen from "@/components/general/loading/LoadingScreen.vue";

import IUserData from "@/interfaces/IUserData";
import UserService from "@/services/UserService";
import CacheManager from "@/utils/CacheManager";
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import SendNotification from "@/utils/SendNotification";
import PostService from "@/services/PostService";
import IUserPost from "@/interfaces/IUserPost";
import PostCommentsModal from "./modals/PostCommentsModal.vue";
import PostInterationsModal from "./modals/PostInterationsModal.vue";
import howManyDaysPassed from "@/utils/howManyDaysPassed";
import DefaultIcon from "@/components/general/icons/DefaultIcon.vue";

onMounted(() => {
  fetchUserData();
  fetchTimeline();
});

const router = useRouter();
const timeline = ref<IUserPost[]>([]);
const authUser = ref();
const timelineIsLoading = ref(true);
const likeIsLoading = ref<boolean>(false);
const dislikeIsLoading = ref<boolean>(false);
const apiRootURL = ref(process.env.VUE_APP_API_ROOT);

const postCommentModal = reactive({
  visible: false,
  post: null,
  open: (post: any) => {
    postCommentModal.post = post;
    postCommentModal.visible = true;
  },
  close: () => {
    postCommentModal.post = null;
    postCommentModal.visible = false;
  },
  update: () => {
    fetchTimeline();
  },
});
const postInterationsModal = reactive({
  visible: false,
  post: null,
  open: (post: any) => {
    postInterationsModal.post = post;
    postInterationsModal.visible = true;
  },
  close: () => {
    postInterationsModal.post = null;
    postInterationsModal.visible = false;
  },
});

async function fetchTimeline() {
  await PostService.getTimeline()
    .then((response) => {
      console.log("Fetch User Timeline", response);
      timeline.value = response.data;
    })
    .catch((error) => {
      console.log("Fetch User Timeline Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message: "Erro interno ao resgatar dados do usuário, tente novamente",
      });
    });

  timelineIsLoading.value = false;
}

async function fetchUserData() {
  await UserService.getUserByUsername(CacheManager.get("__user").username)
    .then((response) => {
      console.log("Fetch User Data", response);
      authUser.value = response.data;
    })
    .catch((error) => {
      console.log("Fetch User Data Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message: "Erro interno ao resgatar dados do usuário, tente novamente",
      });
    });
}

async function handleLikeClick(postID: string) {
  console.log("Handle Like Click");
  likeIsLoading.value = true;

  await PostService.likePost(postID)
    .then((response) => {
      console.log("Like Post", response);

      fetchTimeline();
    })
    .catch((error) => {
      console.log("Like Post Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message: "Erro interno ao dar like na postagem, tente novamente",
      });
    });

  likeIsLoading.value = false;
}

async function handleDislikeClick(postID: string) {
  console.log("Handle Dislike Click");

  dislikeIsLoading.value = true;

  await PostService.dislikePost(postID)
    .then((response) => {
      console.log("Like Post", response);

      fetchTimeline();
    })
    .catch((error) => {
      console.log("Like Post Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message: "Erro interno ao dar dislike na postagem, tente novamente",
      });
    });

  dislikeIsLoading.value = false;
}

function handleUsernameClick(username: string) {
  router.push({
    name: "profile",
    params: {
      username: username,
    },
  });
}

function handleInitPostClick() {
  console.log("Handle Init Post Click");

  router.push({
    name: "profile",
    params: {
      username: authUser.value.username,
    },
  });
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.timeline-view {
  width: 100%;
  height: 100vh;

  .view__timeline-container {
    width: 80%;
    margin: auto;
    padding: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    .post-container {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .body__header {
        width: 100%;

        display: flex;
        align-items: center;
        gap: 10px;

        .header__username {
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }

          font-size: 14px;
          font-weight: 600;
        }

        .header__date {
          font-size: 12px;
          font-weight: 400;
          color: rgb(115, 115, 115);

          &.--large {
            font-size: 16px;
            font-weight: 600;
          }
        }
      }

      .content__image {
        width: 500px;
        height: 500px;

        img {
          border-radius: 10px;

          width: 100%;
          height: 100%;
        }
      }

      .content__description {
        width: 100%;

        .span {
          font-size: 14px;
          margin-top: 20px;
        }
      }

      .body__footer {
        width: 100%;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        gap: 5px;

        .footer__buttons-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;

          .buttons__right-side {
            margin-left: auto;
          }
        }

        .footer__iterations {
          width: 100%;
          margin: 10px 0px;
          padding-bottom: 10px;

          span {
            &:hover {
              text-decoration: underline;
            }

            cursor: pointer;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
    }
  }

  .no-post-message {
    width: max-content;
    max-width: 380px;
    height: 100%;
    margin: auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 12px;

    .view__title {
      font-size: 22px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;

      color: $title-color;
    }

    .view__subtitle {
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;

      text-align: center;

      color: $subtitle-color;

      margin-bottom: 20px;
    }
  }
}
</style>
