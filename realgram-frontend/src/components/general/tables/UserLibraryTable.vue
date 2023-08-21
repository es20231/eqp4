<template>
  <div class="user-library-table-container" id="scroll">
    <!-- Modals -->
    <ImageOptionsModal
      :imageID="imageOptionsModal.imageID"
      v-if="imageOptionsModal.visible"
      @close="imageOptionsModal.close()"
      @cancel="imageOptionsModal.close()"
      @update="imageOptionsModal.update()"
      v-model:open="imageOptionsModal.visible"
    />

    <!-- No Images Message -->
    <div v-if="library.length == 0" class="no-image-message">
      <img alt="Sem Imagem" :src="require('@/assets/svg/no-image.svg')" />
      <span> Comece a capturar e salvar seus momentos favoritos. </span>
    </div>

    <!-- Image Paginated Table -->
    <div class="image-table">
      <template :key="item._id" v-for="item in imageList">
        <div class="image-container" @click="imageOptionsModal.open(item)">
          <img
            class="image__photo"
            :src="apiRootURL + '/uploads/' + item.fileName"
            alt="Imagem da biblioteca do usuário"
          />
          <div class="image-table__hover">
            <DefaultIcon
              name="ri-menu-line"
              size="30px"
              color="white"
            ></DefaultIcon>
            <span>Mais opções</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import ILibraryImage from "@/interfaces/ILibraryImage";
import DefaultIcon from "../icons/DefaultIcon.vue";
import ImageOptionsModal from "@/components/views/sessions/modals/ImageOptionsModal.vue";

interface Props {
  library: ILibraryImage[];
}

const emit = defineEmits(["update"]);

const props = defineProps<Props>();

const imageOptionsModal = reactive({
  visible: false,
  imageID: "",
  open: (image: ILibraryImage) => {
    imageOptionsModal.imageID = image._id;
    imageOptionsModal.visible = true;
  },
  close: () => {
    imageOptionsModal.imageID = "";
    imageOptionsModal.visible = false;
  },
  update: () => {
    imageOptionsModal.close();
    emit("update");
  },
});

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

const imageList = computed(() => {
  const slicedList = props.library.slice(0, displayedImagesCount.value);
  const sortedList = slicedList.reverse();
  return sortedList;
});

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
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;

        span {
          font-size: 18px;
          color: white;
        }
      }
    }
  }
}
</style>
