<template>
  <div class="user-library-table-container" id="scroll">
    <!-- No Images Message -->
    <div v-if="library.length == 0" class="no-image-message">
      <img alt="Sem Imagem" :src="require('@/assets/svg/no-image.svg')" />
      <span> Comece a capturar e salvar seus momentos favoritos. </span>
    </div>

    <!-- Image Paginated Table -->
    <div class="image-table">
      <img
        :key="item._id"
        :src="apiRootURL + '/uploads/' + item.fileName"
        class="table__img"
        v-for="item in library.slice(0, displayedImagesCount)"
        alt="Imagem da biblioteca do usuário"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ILibraryImage from "@/interfaces/ILibraryImage";

interface Props {
  library: ILibraryImage[];
}

defineProps<Props>();

onMounted(() => {
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Verifica se o usuário chegou ao final da página
    if (scrollY + windowHeight >= documentHeight) {
      loadMoreImages();
    }
  });
});

const imagesPerPage = 9;
const displayedImagesCount = ref(imagesPerPage);
const apiRootURL = ref(process.env.VUE_APP_API_ROOT);

// Function to load more images
const loadMoreImages = () => {
  displayedImagesCount.value += imagesPerPage;
};
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
      width: 100%;
      height: 320px;

      object-fit: revert;
    }
  }
}
</style>
