<template>
  <a-modal
    centered
    size="large"
    :width="350"
    :footer="false"
    title="Comentários"
    class="posts-comments-modal"
  >
    <div class="modal__content">
      <div class="content__no-item">
        <span>Sem comentários na postagem.</span>
      </div>

      <template :key="comment._id" v-for="comment in commentList">
        <div class="content__message">
          <a-avatar
            :size="38"
            :src="
              comment.user.profilePhoto
                ? apiRootURL + '/uploads/' + comment.user.profilePhoto
                : require('@/assets/imgs/default-avatar.png')
            "
          />

          <div class="message__data">
            <span class="data__comment">
              <strong>{{ comment.user.profilePhoto }}</strong>
              {{ comment.text }}
            </span>

            <div class="data__stats">
              <span class="stats__time">{{
                howManyDaysPassed(comment.createdAt)
              }}</span>
            </div>
          </div>

          <DefaultIcon name="ri-heart-line" size="15px"></DefaultIcon>
        </div>
      </template>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import DefaultIcon from "@/components/general/icons/DefaultIcon.vue";
import IUserPost from "@/interfaces/IUserPost";
import IPostComment from "@/interfaces/IPostComment";
import howManyDaysPassed from "@/utils/howManyDaysPassed";

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

function fillCommentList(post: IUserPost | null) {
  if (post == null) return;

  console.log("Fill Comment List", post);
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.posts-comments-modal {
  .modal__content {
    width: 100%;
    max-height: 60vh;

    display: flex;
    flex-direction: column;
    gap: 10px;

    margin: 15px 0px;

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
  }
}
</style>
