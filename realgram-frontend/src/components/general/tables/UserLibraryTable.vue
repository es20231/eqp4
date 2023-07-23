<template>
  <div class="user-library-table-container">
    <!-- No Images Message -->
    <div v-if="library.length == 0" class="no-image-message">
      <img alt="Sem Imagem" :src="require('@/assets/svg/no-image.svg')" />
      <span> Comece a capturar e salvar seus momentos favoritos. </span>
    </div>

    <!-- Image Paginated Table -->
    <div class="image-table" v-else>
      <img
        :key="item._id"
        :src="item.photo"
        class="table__img"
        v-for="item in library"
        alt="Imagem da biblioteca do usuário"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ILibraryImage from "@/interfaces/ILibraryImage";

interface Props {
  library: ILibraryImage[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";
.user-library-table-container {
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
      width: 270px;
      height: 320px;

      object-fit: cover;
    }
  }
}
</style>
