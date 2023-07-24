<template>
  <a-modal
    :width="600"
    size="large"
    okText="Salvar"
    @ok="handleSaveImageClick"
    class="upload-library-modal"
    :loading="saveImageIsLoading"
    title="Salvar imagem na biblioteca"
  >
    <div class="modal__content">
      <a-upload-dragger
        :height="300"
        accept="image/"
        name="library-file"
        :showUploadList="false"
        :customRequest="handleSelect"
        v-model:fileList="fileList"
        class="content__upload-dragger"
      >
        <div v-if="fileList.length == 0" class="dragger__message">
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">Enviar Imagem</p>
          <p class="ant-upload-hint">
            Para salvar uma imagem na sua biblioteca basta clicar aqui ou
            arrastar a imagem do seu computador para esta área.
          </p>
        </div>
        <div v-else class="dragger__selected-img">
          <DefaultButton
            danger
            type="text"
            class="selected-img__remove-btn"
            @click.stop="handleRemoveImageClick"
            >Remover</DefaultButton
          >
          <img
            :src="selectedImageUrl"
            alt="Imagem
          selecionada para salvar."
          />
        </div>
      </a-upload-dragger>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";

import { ref, computed } from "vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import SendNotification from "@/utils/SendNotification";
import LibraryService from "@/services/LibraryService";

const emit = defineEmits(["close"]);

declare var URL: any;

const fileList = ref<any>([]);
const saveImageIsLoading = ref<boolean>(false);

const selectedImage = computed((): File => {
  return fileList.value[0];
});

const selectedImageUrl = computed(() => {
  if (selectedImage.value) {
    return URL.createObjectURL(selectedImage.value);
  }
  return "";
});

function handleRemoveImageClick() {
  fileList.value = [];
}

function handleSelect(event: any) {
  console.log("handleSelect");

  const maxSizeInBytes = 10 * 1024 * 1024;
  const file: File = event.file;

  console.log(file);

  if (!file.type.includes("image")) {
    SendNotification("warning", {
      duration: 3,
      placement: "bottomRight",
      message:
        "O arquivo selecionado não é uma imagem válida. Por favor, selecione uma imagem!",
    });
    return;
  }

  if (file.size > maxSizeInBytes) {
    SendNotification("warning", {
      duration: 3,
      placement: "bottomRight",
      message:
        "O arquivo selecionado é maior do que 10 MB. Por favor, selecione uma imagem menor!",
    });
    return;
  }

  fileList.value = [event.file];
  console.log(fileList.value);
}

async function handleSaveImageClick() {
  if (fileList.value.length == 0) {
    SendNotification("warning", {
      duration: 3,
      placement: "bottomRight",
      message: "Por favor, selecione ao menos uma imagem.",
    });
    return;
  }

  saveImageIsLoading.value = true;

  await LibraryService.saveImageInLibrary(selectedImage.value)
    .then((response) => {
      console.log("Save Image in Library Successful: ", response);

      emit("close");
    })
    .catch((error) => {
      console.log("Save Image in Library Error: ", error);

      if (error.response) {
        SendNotification("error", {
          duration: 3,
          placement: "bottomRight",
          message: error.response.data.error,
        });
      } else {
        SendNotification("error", {
          duration: 3,
          placement: "bottomRight",
          message:
            "Erro interno ao salvar imagem na sua biblioteca, tente novamente.",
        });
      }
    });

  saveImageIsLoading.value = false;
}
</script>

<style scoped lang="scss">
.upload-library-modal {
  .modal__content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .content__upload-dragger {
      width: 100%;
      max-height: 300px;
      .dragger__message {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        p {
          max-width: 90%;
        }
      }

      .dragger__selected-img {
        position: relative;

        img {
          width: 100%;
          max-height: 270px;
          object-fit: contain;
        }

        .selected-img__remove-btn {
          position: absolute;
          right: 15px;
          bottom: 0px;
        }
      }
    }
  }
}
</style>
