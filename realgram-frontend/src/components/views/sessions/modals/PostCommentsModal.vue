<template>
  <a-modal
    centered
    size="large"
    :width="350"
    title="Comentários"
    class="posts-comments-modal"
  >
    <div class="comment-list-container">
      <div class="content__no-item" v-if="commentList.length == 0">
        <span>Sem comentários na postagem.</span>
      </div>

      <template :key="comment._id" v-for="comment in commentList">
        <div class="content__message">
          <a-avatar
            :size="38"
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
              <span class="stats__time">{{
                howManyDaysPassed(comment.createdAt)
              }}</span>
            </div>
          </div>

          <DefaultIcon
            color="ri-eraser-fill"
            name="ri-delete-line"
            size="15px"
          ></DefaultIcon>
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
import { ref, onMounted } from "vue";

import DefaultIcon from "@/components/general/icons/DefaultIcon.vue";
import IUserPost from "@/interfaces/IUserPost";
import IPostComment from "@/interfaces/IPostComment";
import howManyDaysPassed from "@/utils/howManyDaysPassed";
import DefaultTextArea from "@/components/general/inputs/DefaultTextArea.vue";
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";
import SendNotification from "@/utils/SendNotification";
import PostService from "@/services/PostService";

interface Props {
  post: IUserPost | null;
}

const props = defineProps<Props>();

const emit = defineEmits(["update"]);

onMounted(() => {
  fillCommentList(props.post);
});

// const router = useRouter();
const apiRootURL = ref(process.env.VUE_APP_API_ROOT);
const commentList = ref<IPostComment[]>([]);
const commentIsLoading = ref<boolean>(false);
const inputComment = ref<string>("");

function fillCommentList(post: IUserPost | null) {
  console.log("Fill Comment List", post);

  if (post == null) return;
  commentList.value = post.comentarios;
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
      fillCommentList(response.data);

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
        message: "Erro interno ao dar dislike na postagem, tente novamente",
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
          font-size: 12px;
        }

        .data__stats {
          margin-left: auto;
          font-size: 12px;
          color: $data-info-color;
        }
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
</style>
