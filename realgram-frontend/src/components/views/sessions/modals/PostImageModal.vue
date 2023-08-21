<template>
  <a-modal
    size="large"
    :width="800"
    :footer="false"
    title="Criar Nova Publicação"
    class="image-options-modal"
  >
    <div class="modal__content">
      <div class="content__image">
        <img
          alt="Imagem a ser postada na timeline."
          :src="apiRootURL + '/uploads/' + image.fileName"
        />
      </div>

      <div class="content__body">
        <div class="body__header">
          <a-avatar
            :size="38"
            :src="
              authUser.profilePhoto
                ? apiRootURL + '/uploads/' + authUser.profilePhoto
                : require('@/assets/imgs/default-avatar.png')
            "
          />
          <span>
            {{ authUser.username }}
          </span>
        </div>

        <div class="body__form">
          <DefaultTextArea
            :rows="4"
            :maxlength="300"
            v-model="inputData.description"
            placeholder="Escreva uma descrição..."
          ></DefaultTextArea>

          <DefaultButton type="primary" @click="postImageToTimeline"
            >Postar</DefaultButton
          >
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";

import { ref, computed, reactive } from "vue";
import ILibraryImage from "@/interfaces/ILibraryImage";
import SendNotification from "@/utils/SendNotification";
import CacheManager from "@/utils/CacheManager";
import IUserData from "@/interfaces/IUserData";
import DefaultTextArea from "@/components/general/inputs/DefaultTextArea.vue";
import PostService from "@/services/PostService";

interface Props {
  image: ILibraryImage;
}

const props = defineProps<Props>();

const emit = defineEmits(["update"]);

// const router = useRouter();
const postIsLoading = ref<boolean>(false);
const apiRootURL = ref(process.env.VUE_APP_API_ROOT);
const inputData = reactive<any>({
  description: "",
});

const authUser = computed((): IUserData => {
  return CacheManager.get("__user");
});

async function postImageToTimeline() {
  postIsLoading.value = true;
  const imageURL = apiRootURL.value + "/uploads/" + props.image.fileName;
  const imageFile = await downloadImageAndCreateFile(imageURL);

  await PostService.saveImageInLibrary(imageFile, inputData.description)
    .then((response) => {
      console.log("Post Image", response);

      SendNotification("success", {
        duration: 3,
        placement: "bottomRight",
        message: "Postagem criada com sucesso, veja na sua linha do tempo.",
      });

      emit("update");
    })
    .catch((error) => {
      console.log("Post Image Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message: "Erro interno ao criar postagem, tente novamente",
      });
    });

  postIsLoading.value = false;
}

async function downloadImageAndCreateFile(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  // Extract the filename from the URL or provide a custom filename
  const filename = url.substring(url.lastIndexOf("/") + 1);

  // Create a new File object
  const file = new File([blob], filename, { type: blob.type });

  return file;
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

        display: flex;
        align-items: center;
        gap: 10px;

        span {
          font-size: 14px;
          font-weight: 600;
        }
      }

      .body__form {
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;

        gap: 10px;
      }
    }
  }
}
</style>
