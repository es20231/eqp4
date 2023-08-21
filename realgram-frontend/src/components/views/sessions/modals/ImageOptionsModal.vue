<template>
  <a-modal
    centered
    size="large"
    :width="350"
    :footer="false"
    title="Opções"
    class="image-options-modal"
  >
    <div class="modal__content">
      <template :key="item.key" v-for="item in menuOptions">
        <DefaultButton block @click="item.function()">{{
          item.label
        }}</DefaultButton>
      </template>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SendNotification from "@/utils/SendNotification";
import LibraryService from "@/services/LibraryService";
import { Modal } from "ant-design-vue";
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";
import ILibraryImage from "@/interfaces/ILibraryImage";

interface Props {
  image: ILibraryImage;
}

const props = defineProps<Props>();

const emit = defineEmits(["update", "postImage"]);

const deleteIsLoading = ref<boolean>(false);
const menuOptions = ref([
  {
    key: "post",
    title: "post",
    label: "Postar na Timeline",
    icon: "ri-home-line",
    function: handlePostImage,
  },
  {
    key: "delete",
    title: "delete",
    label: "Remover da biblioteca",
    icon: "ri-home-line",
    function: confirmDeleteModal,
  },
]);

function handlePostImage() {
  emit("postImage", props.image);
}

function confirmDeleteModal() {
  Modal.confirm({
    centered: true,
    title: "Você tem certeza?",
    content: "Uma imagem apagada da biblioteca não poderá ser recuperada.",
    async onOk() {
      await deleteImageFromLibrary();
    },
    onCancel() {
      console.log("close confirm delete modal");
    },
  });
}

async function deleteImageFromLibrary() {
  deleteIsLoading.value = true;

  await LibraryService.deleteImageFromLibrary(props.image._id)
    .then((response) => {
      console.log("Delete Image", response);

      SendNotification("success", {
        duration: 3,
        placement: "bottomRight",
        message: "Imagem removida da biblioteca com sucesso!",
      });

      emit("update");
    })
    .catch((error) => {
      console.log("Delete Image Error", error);

      SendNotification("error", {
        duration: 3,
        placement: "bottomRight",
        message:
          "Erro interno ao remover imagem da biblioteca, tente novamente",
      });
    });

  deleteIsLoading.value = false;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.image-options-modal {
  .modal__content {
    width: 300px;
    height: max-content;
    display: flex;
    flex-direction: column;
    gap: 12px;

    margin-top: 20px;
  }
}
</style>
