<template>
  <a-modal
    size="large"
    :width="800"
    :footer="false"
    title="Detalhes da publicação"
    class="image-options-modal"
  >
    <!-- Modals -->
    <PostCommentsModal
      :post="postCommentModal.post"
      v-if="postCommentModal.visible"
      @close="postCommentModal.close()"
      @cancel="postCommentModal.close()"
      v-model:open="postCommentModal.visible"
    />
    <PostInterationsModal
      :post="postInterationsModal.post"
      v-if="postInterationsModal.visible"
      @close="postInterationsModal.close()"
      @cancel="postInterationsModal.close()"
      v-model:open="postInterationsModal.visible"
    />

    <!-- Content -->
    <div class="modal__content">
      <div class="content__image">
        <img
          alt="Imagem a ser postada na timeline."
          :src="apiRootURL + '/uploads/' + postData?.photo"
        />
      </div>

      <div class="content__body">
        <div class="body__header">
          <a-avatar
            :size="38"
            :src="
              user.profilePhoto
                ? apiRootURL + '/uploads/' + user.profilePhoto
                : require('@/assets/imgs/default-avatar.png')
            "
          />
          <span @click="handleUsernameClick">
            {{ user.username }}
          </span>
        </div>

        <div class="body__description">
          <span class="description__text">
            {{ postData?.body }}
          </span>
          <span class="description__date">
            {{ howManyDaysPassed(postData ? postData.createdAt : "") }}
          </span>
        </div>

        <div class="body__footer">
          <div class="footer__buttons-container">
            <DefaultIcon
              pointer
              size="20px"
              :name="
                postData?.likes.map((like) => like._id).includes(authUser._id)
                  ? 'ri-thumb-up-fill'
                  : 'ri-thumb-up-line'
              "
              @click="handleLikeClick"
            ></DefaultIcon>
            <DefaultIcon
              pointer
              size="20px"
              :name="
                postData?.dislikes
                  .map((dislike) => dislike._id)
                  .includes(authUser._id)
                  ? 'ri-thumb-down-fill'
                  : 'ri-thumb-down-line'
              "
              @click="handleDislikeClick"
            ></DefaultIcon>
            <DefaultIcon
              pointer
              size="20px"
              name="ri-chat-1-line"
              @click="postCommentModal.open(postData)"
            ></DefaultIcon>
            <DefaultIcon
              pointer
              size="20px"
              color="red"
              name="ri-delete-bin-2-line"
              class="buttons__right-side"
              @click="confirmDeleteModal()"
            ></DefaultIcon>
          </div>

          <div class="footer__iterations">
            <span @click="postInterationsModal.open(postData)">{{
              `${iterationsCounter} ${
                iterationsCounter == 1 ? "interação" : "interações"
              } com a postagem`
            }}</span>
          </div>

          <div class="footer__send-comment">
            <DefaultTextArea
              :minRows="1"
              :maxRows="3"
              :maxlength="300"
              :bordered="false"
              v-model="inputComment"
              placeholder="Escreva um comentário..."
            ></DefaultTextArea>
            <DefaultButton
              @click="handleSentComment"
              :loading="commentIsLoading"
              >Comentar</DefaultButton
            >
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import DefaultIcon from "@/components/general/icons/DefaultIcon.vue";

import { useRouter } from "vue-router";
import { ref, computed, reactive, onMounted } from "vue";
import IUserPost from "@/interfaces/IUserPost";
import IUserData from "@/interfaces/IUserData";
import howManyDaysPassed from "@/utils/howManyDaysPassed";
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";
import DefaultTextArea from "@/components/general/inputs/DefaultTextArea.vue";
import PostService from "@/services/PostService";
import SendNotification from "@/utils/SendNotification";
import CacheManager from "@/utils/CacheManager";
import PostCommentsModal from "./PostCommentsModal.vue";
import PostInterationsModal from "./PostInterationsModal.vue";
import { Modal } from "ant-design-vue";

interface Props {
  user: IUserData;
  post: IUserPost | null;
}

const props = defineProps<Props>();

const emit = defineEmits(["update"]);

onMounted(() => {
  if (props.post) fillPostData(props.post);
});

const router = useRouter();
const inputComment = ref<string>("");
const commentIsLoading = ref<boolean>(false);
const likeIsLoading = ref<boolean>(false);
const dislikeIsLoading = ref<boolean>(false);
const apiRootURL = ref(process.env.VUE_APP_API_ROOT);
const postData = reactive<IUserPost>({
  _id: "",
  title: "",
  body: "",
  photo: "",
  likes: [],
  dislikes: [],
  comentarios: [],
  postedBy: props.user,
  createdAt: "",
  updatedAt: "",
});
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

function confirmDeleteModal() {
  Modal.confirm({
    centered: true,
    title: "Você tem certeza?",
    content: "Uma postagem apagada não poderá ser recuperada.",
    async onOk() {
      SendNotification("info", {
        duration: 3,
        placement: "bottomRight",
        message: "Em construção...",
      });
    },
    onCancel() {
      console.log("close confirm delete modal");
    },
  });
}

function fillPostData(post: IUserPost) {
  console.log("Fill Post Data", post);

  postData._id = post._id;
  postData.title = post.title;
  postData.body = post.body;
  postData.body = post.body;
  postData.photo = post.photo;
  postData.likes = post.likes;
  postData.dislikes = post.dislikes;
  postData.comentarios = post.comentarios;
  postData.postedBy = post.postedBy;
  postData.createdAt = post.createdAt;
  postData.updatedAt = post.updatedAt;
}

const authUser = computed((): IUserData => {
  return CacheManager.get("__user");
});

const iterationsCounter = computed(() => {
  const likes = postData.likes.length;
  const dislikes = postData.dislikes.length;
  // const comments = postData.comentarios.length;
  return likes + dislikes;
});

function handleUsernameClick() {
  router.push({
    name: "profile",
    params: {
      username: props.user.username,
    },
  });
}

async function handleLikeClick() {
  console.log("Handle Like Click");
  likeIsLoading.value = true;

  await PostService.likePost(props.post ? props.post._id : "")
    .then((response) => {
      console.log("Like Post", response);

      emit("update");

      fillPostData(response.data);
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

async function handleDislikeClick() {
  console.log("Handle Dislike Click");

  dislikeIsLoading.value = true;

  await PostService.dislikePost(props.post ? props.post._id : "")
    .then((response) => {
      console.log("Like Post", response);

      emit("update");

      fillPostData(response.data);
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

async function handleSentComment() {
  console.log("Handle Sent Comment", inputComment.value);

  if (inputComment.value == "") {
    SendNotification("warning", {
      duration: 3,
      placement: "bottomRight",
      message: "Insira algum comentário.",
    });
    return;
  }

  commentIsLoading.value = true;

  await PostService.sentComment(
    inputComment.value,
    props.post ? props.post._id : ""
  )
    .then((response) => {
      console.log("Comment Post", response);

      emit("update");
      inputComment.value = "";
      fillPostData(response.data);

      SendNotification("success", {
        duration: 3,
        placement: "bottomRight",
        message:
          "Comentário realizado com sucesso, clique no botão de comentários para visualiza-lo!",
      });
    })
    .catch((error) => {
      console.log("Comment Post Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message: "Erro interno ao dar dislike na postagem, tente novamente",
      });
    });

  commentIsLoading.value = false;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.image-options-modal {
  .modal__content {
    width: 100%;
    height: 60vh;

    display: grid;
    grid-template-columns: 6fr 4fr;
    gap: 20px;

    .content__image {
      width: 100%;
      height: 60vh;

      img {
        border-radius: 10px;

        width: 100%;
        height: 100%;
      }
    }

    .content__body {
      width: 100%;
      height: 100%;

      display: flex;
      flex-direction: column;
      gap: 12px;

      .body__header {
        width: 100%;

        padding: 3px 10px;

        display: flex;
        align-items: center;
        gap: 10px;

        span {
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }

          font-size: 14px;
          font-weight: 600;
        }
      }

      .body__description {
        width: 100%;
        height: 100%;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        gap: 5px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        .description__text {
          font-size: 14px;
          margin-top: 20px;
        }

        .description__date {
          font-size: 12px;
          color: rgb(115, 115, 115);
        }
      }

      .body__footer {
        width: 100%;
        display: flex;
        flex-direction: column;

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

          span {
            &:hover {
              text-decoration: underline;
            }

            cursor: pointer;
            font-size: 14px;
            font-weight: 400;
          }
        }

        .footer__send-comment {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;

          gap: 10px;
          padding-top: 15px;
          margin-top: 10px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}
</style>
