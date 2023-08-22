<template>
  <a-modal
    centered
    size="large"
    :width="350"
    :footer="false"
    title="Interações"
    class="post-interations-modal"
  >
    <div class="modal__content">
      <div class="content__no-item" v-if="interationList.length == 0">
        <span>Sem interações na postagem.</span>
      </div>

      <template :key="user._id" v-for="user in interationList">
        <div class="content__message">
          <a-avatar
            :size="45"
            :src="
              user.profilePhoto
                ? apiRootURL + '/uploads/' + user.profilePhoto
                : require('@/assets/imgs/default-avatar.png')
            "
          />

          <span @click="handleUserClick(user)">{{ user.username }}</span>

          <DefaultIcon
            size="20px"
            :name="
              user.type == 'like' ? 'ri-thumb-up-fill' : 'ri-thumb-down-fill'
            "
            class="message__icon"
          ></DefaultIcon>
        </div>
      </template>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import DefaultIcon from "@/components/general/icons/DefaultIcon.vue";
import IUserPost from "@/interfaces/IUserPost";
import IUserData from "@/interfaces/IUserData";
import { useRouter } from "vue-router";

interface Props {
  post: IUserPost | null;
}

interface IInterationList extends IUserData {
  type: string;
}

const props = defineProps<Props>();

onMounted(() => {
  fillCommentList(props.post);
});

const router = useRouter();
const apiRootURL = ref(process.env.VUE_APP_API_ROOT);
const interationList = ref<IInterationList[]>([]);

function fillCommentList(post: IUserPost | null) {
  if (post == null) return;

  let interationArray: IInterationList[] = [];

  post.likes.forEach((like) => {
    interationArray.push({
      ...like,
      type: "like",
    });
  });
  post.dislikes.forEach((like) => {
    interationArray.push({
      ...like,
      type: "dislike",
    });
  });

  interationList.value = interationArray;

  console.log("Fill Comment List", post);
}

function handleUserClick(user: IUserData) {
  console.log("Handle User Click");

  router.push({
    name: "profile",
    params: {
      username: user.username,
    },
  });
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.post-interations-modal {
  .modal__content {
    width: 100%;
    max-height: 60vh;
    padding: 0 10px;
    margin: 15px 0px;

    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;

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
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 15px;

      span {
        font-size: 14px;
        font-weight: 600;

        &:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }

      .message__icon {
        margin-left: auto;
      }
    }
  }
}
</style>
