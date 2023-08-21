<template>
  <div class="user-post-table-container">
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
    <div class="image-table" v-else>
      <img
        :key="item._id"
        class="table__img"
        v-for="item in posts"
        alt="Imagem do post do usuário"
        :src="apiRootURL + '/uploads/' + item.photo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import IUserPost from "@/interfaces/IUserPost";
import { ref } from "vue";

interface Props {
  posts: IUserPost[];
  isAuthUserProfile: boolean;
}

defineProps<Props>();

const apiRootURL = ref(process.env.VUE_APP_API_ROOT);
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

    .table__img {
      width: 100%;
      height: 320px;

      object-fit: revert;
    }
  }
}
</style>
