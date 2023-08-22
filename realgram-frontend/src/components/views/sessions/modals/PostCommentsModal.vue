<template>
  <a-modal
    centered
    size="large"
    :width="350"
    title="Comentários"
    class="posts-comments-modal"
  >
    <div class="comment-list-container">
      <div class="content__no-item" v-if="commentList?.length == 0">
        <span>Sem comentários na postagem.</span>
      </div>

      <template :key="comment._id" v-for="comment in commentList">
        <div class="content__message">
          <a-avatar
            :size="45"
            :src="
              comment.postedBy.profilePhoto
                ? apiRootURL + '/uploads/' + comment.postedBy.profilePhoto
                : require('@/assets/imgs/default-avatar.png')
            "
          />

          <div class="message__data">
            <span class="data__comment">
              <strong>{{ comment.postedBy.username }}</strong>
              {{ comment.text }}
            </span>

            <div class="data__stats">
              <DefaultIcon
                pointer
                size="15px"
                color="red"
                name="ri-delete-bin-line"
                v-if="authUserCanDeleteComment(comment)"
                @click="confirmDeleteModal(comment)"
              ></DefaultIcon>
              <span class="stats__time">{{
                howManyDaysPassed(comment.createdAt)
              }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <template #footer>
      <div class="footer__send-comment">
        <DefaultTextArea
          :minRows="1"
          :maxRows="3"
          :maxlength="300"
          :bordered="false"
          v-model="inputComment"
          placeholder="Escreva um comentário..."
        ></DefaultTextArea>
        <DefaultButton @click="handleSentComment" :loading="commentIsLoading"
          >Comentar</DefaultButton
        >
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import DefaultIcon from "@/components/general/icons/DefaultIcon.vue";
import IUserPost from "@/interfaces/IUserPost";
import IPostComment from "@/interfaces/IPostComment";
import howManyDaysPassed from "@/utils/howManyDaysPassed";
import DefaultTextArea from "@/components/general/inputs/DefaultTextArea.vue";
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";
import SendNotification from "@/utils/SendNotification";
import PostService from "@/services/PostService";
import CacheManager from "@/utils/CacheManager";
import IUserData from "@/interfaces/IUserData";
import { Modal } from "ant-design-vue";

interface Props {
  post: IUserPost | null;
}

const props = defineProps<Props>();

const emit = defineEmits(["update"]);

onMounted(() => {
  fillCommentList(props.post?.comentarios);
});

// const router = useRouter();
const apiRootURL = ref(process.env.VUE_APP_API_ROOT);
const commentList = ref<IPostComment[]>([]);
const commentIsLoading = ref<boolean>(false);
const deleteIsLoading = ref<boolean>(false);
const inputComment = ref<string>("");
const commentToDelete = ref<any>();

const authUser = computed((): IUserData => {
  return CacheManager.get("__user");
});

function authUserCanDeleteComment(comment: any) {
  return (
    comment._id == authUser.value._id ||
    props.post?.postedBy._id == authUser.value._id
  );
}

function confirmDeleteModal(comment: any) {
  commentToDelete.value = comment;
  Modal.confirm({
    centered: true,
    title: "Você tem certeza?",
    content: "Um comentário apagado não poderá ser recuperado.",
    async onOk() {
      await handleDeleteCommentClick(commentToDelete.value);
    },
    onCancel() {
      console.log("close confirm delete modal");
    },
  });
}

async function handleDeleteCommentClick(comment: any) {
  console.log("Handle Delete Comment Click: ", comment);

  deleteIsLoading.value = true;

  await PostService.deleteComment(comment._id, `${props.post?._id}`)
    .then((response) => {
      console.log("Delete Comment Post", response);

      emit("update");
      inputComment.value = "";
      fillCommentList(response.data);

      SendNotification("success", {
        duration: 3,
        placement: "bottomRight",
        message: "Comentário removido da postagem com sucesso!",
      });
    })
    .catch((error) => {
      console.log("Delete Comment Post Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message:
          "Erro interno ao remover comentário da postagem, tente novamente",
      });
    });

  deleteIsLoading.value = false;
}

function fillCommentList(list: any) {
  console.log("Fill Comment List", list);

  if (list == null) return;
  commentList.value = list;
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
      fillCommentList(response.data.comentarios);

      SendNotification("success", {
        duration: 3,
        placement: "bottomRight",
        message: "Comentário realizado com sucesso!",
      });
    })
    .catch((error) => {
      console.log("Comment Post Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message: "Erro interno ao realizar comentário, tente novamente",
      });
    });

  commentIsLoading.value = false;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.posts-comments-modal {
  .comment-list-container {
    width: 100%;
    max-height: 50vh;
    overflow: auto;

    display: flex;
    flex-direction: column;
    gap: 10px;

    margin: 15px 0px;
    padding-right: 10px;

    .content__no-item {
      width: 100%;
      margin-top: 20px;
      text-align: center;

      span {
        font-size: 15px;
        font-weight: 500;

        color: $placeholder-color;
      }
    }

    .content__message {
      display: flex;
      gap: 12px;

      .message__data {
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .data__username {
          font-size: 14px;
          font-weight: 600;
        }

        .data__comment {
          font-size: 14px;
        }

        .data__stats {
          display: flex;
          align-items: flex-end;
          gap: 5px;

          margin-left: auto;
          font-size: 12px;
          color: $data-info-color;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.posts-comments-modal {
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
</style>
