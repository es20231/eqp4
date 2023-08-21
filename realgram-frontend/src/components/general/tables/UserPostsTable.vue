<template>
  <div class="user-post-table-container">
    <!-- Modals -->
    <ImageDataModal
      :user="user"
      :post="imageDataModal.image"
      v-if="imageDataModal.visible"
      @close="imageDataModal.close()"
      @cancel="imageDataModal.close()"
      @update="imageDataModal.update()"
      v-model:open="imageDataModal.visible"
    />

    <!-- No Images Message -->
    <div v-if="posts.length == 0" class="no-image-message">
      <img alt="Sem Imagem" :src="require('@/assets/svg/no-image.svg')" />
      <span>
        {{
          isAuthUserProfile
            ? "Faça uma postagem e compartilhe suas histórias com seus amigos."
            : "Ainda não há nenhuma publicação."
        }}
      </span>
    </div>

    <!-- Image Paginated Table -->
    <div class="image-table">
      <template :key="item._id" v-for="item in imageList">
        <div class="image-container" @click="imageDataModal.open(item)">
          <img
            class="image__photo"
            :src="apiRootURL + '/uploads/' + item.photo"
            alt="Imagem da biblioteca do usuário"
          />
          <div class="image-table__hover">
            <DefaultIcon
              name="ri-thumb-up-fill"
              size="18px"
              color="white"
            ></DefaultIcon>
            <span>{{ item.likes.length }}</span>
            <DefaultIcon
              name="ri-thumb-down-fill"
              size="18px"
              color="white"
            ></DefaultIcon>
            <span>{{ item.dislikes.length }}</span>
            <DefaultIcon
              name="ri-chat-1-fill"
              size="18px"
              color="white"
            ></DefaultIcon>
            <span>{{ item.comentarios.length }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import IUserPost from "@/interfaces/IUserPost";
import { ref, computed, reactive } from "vue";
import DefaultIcon from "../icons/DefaultIcon.vue";
import IUserData from "@/interfaces/IUserData";

import ImageDataModal from "@/components/views/sessions/modals/ImageDataModal.vue";

const emit = defineEmits(["update"]);

interface Props {
  user: IUserData;
  posts: IUserPost[];
  isAuthUserProfile: boolean;
}

const props = defineProps<Props>();

const imagesPerPage = 9;
const displayedImagesCount = ref(imagesPerPage);
const apiRootURL = ref(process.env.VUE_APP_API_ROOT);

const imageDataModal = reactive({
  visible: false,
  image: null,
  open: (image: any) => {
    imageDataModal.image = image;
    imageDataModal.visible = true;
  },
  close: () => {
    imageDataModal.image = null;
    imageDataModal.visible = false;
  },
  update: () => {
    emit("update");
  },
});

const imageList = computed(() => {
  const sortedList = [...props.posts].reverse();
  const slicedList = sortedList.slice(0, displayedImagesCount.value);
  return slicedList;
});
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";
.user-post-table-container {
  .no-image-message {
    width: 100%;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;
    gap: 15px;

    margin-top: 20px;

    img {
      width: 50px;
      height: 50px;

      object-fit: cover;
    }

    span {
      font-size: 14px;
      font-weight: 400;
      color: $placeholder-color;
    }
  }
  .image-table {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;

    .image-container {
      position: relative;
      height: 320px;

      .image__photo {
        width: 100%;
        height: 100%;

        object-fit: revert;
      }

      &:hover {
        .image-table__hover {
          display: flex;
        }
      }

      .image-table__hover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        opacity: 0.75;
        cursor: pointer;
        background-color: black;
        transition: opacity 0.3s ease-in-out;

        display: none; // just show in hover case
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;

        span {
          font-size: 18px;
          color: white;
        }
      }
    }
  }
}
</style>
