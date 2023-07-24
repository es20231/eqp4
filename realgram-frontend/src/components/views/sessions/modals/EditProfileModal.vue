<template>
  <a-modal
    size="large"
    :width="600"
    okText="Salvar"
    title="Editar perfil"
    @ok="handleSaveUserData"
    class="edit-profile-modal"
    :confirm-loading="saveImageIsLoading"
  >
    <div class="modal__content">
      <!-- Edit Image -->
      <div class="content__option-column">
        <img
          :src="
            inputData.profilePhoto
              ? profilePhotoURL
              : require('@/assets/imgs/default-avatar.png')
          "
        />
        <span class="option-row__data">{{ inputData.username }}</span>

        <div class="content__option-row --flex">
          <div>
            <DefaultButton type="link" @click="openImageSelection"
              >Alterar foto do perfil</DefaultButton
            >
            <input
              ref="imageInputRef"
              type="file"
              accept="image/*"
              capture="environment"
              style="display: none"
              @change="handleImageChange"
            />
          </div>
          <DefaultButton danger type="link" @click="removeProfilePhoto()"
            >Remover foto do perfil</DefaultButton
          >
        </div>
      </div>

      <!-- Edit Name -->
      <div class="content__option-row">
        <span class="option-row__title">Nome</span>

        <DefaultInput
          v-model="inputData.name"
          placeholder="Insira seu nome"
        ></DefaultInput>
      </div>

      <!-- Edit Description -->
      <div class="content__option-row">
        <span class="option-row__title">Biografia</span>

        <DefaultTextArea
          :rows="4"
          :maxlength="300"
          v-model="inputData.description"
        ></DefaultTextArea>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";
import DefaultInput from "@/components/general/inputs/DefaultInput.vue";
import DefaultTextArea from "@/components/general/inputs/DefaultTextArea.vue";

import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import UserService from "@/services/UserService";
import IUserData from "@/interfaces/IUserData";
import { ref, reactive, onMounted, computed } from "vue";
import SendNotification from "@/utils/SendNotification";

interface Props {
  userData: IUserData;
}

const emit = defineEmits(["update"]);
const props = defineProps<Props>();

onMounted(() => {
  inputData.id = props.userData._id;
  inputData.name = props.userData.name;
  inputData.username = props.userData.username;
  inputData.description = props.userData.description;
  inputData.profilePhoto = props.userData.profilePhoto;
});

const imageInputRef = ref<HTMLInputElement | null>(null);
const saveImageIsLoading = ref(false);
const inputData = reactive<any>({
  id: "",
  name: "",
  username: "",
  description: "",
  profilePhoto: "",
});

const vuelidateRules = {
  name: {
    required: helpers.withMessage(
      "Por favor, insira um nome para seu perfil.",
      required
    ),
  },
};

const v$ = useVuelidate(vuelidateRules, inputData);

const profilePhotoURL = computed(() => {
  if (typeof inputData.profilePhoto === "string") {
    return "http://localhost:3000/uploads/" + inputData.profilePhoto;
  } else if (inputData.profilePhoto instanceof File) {
    return URL.createObjectURL(inputData.profilePhoto);
  }
  return "";
});

function removeProfilePhoto() {
  inputData.profilePhoto = "";
}

function openImageSelection() {
  if (imageInputRef.value) {
    imageInputRef.value.click();
  }
}

function handleImageChange(event: Event) {
  const input = event.target as HTMLInputElement;

  if (!input.files) return;

  const selectedFile = input.files[0];
  const maxSizeInBytes = 10 * 1024 * 1024;

  if (selectedFile && selectedFile.size > maxSizeInBytes) {
    SendNotification("warning", {
      duration: 3,
      placement: "bottomRight",
      message:
        "O arquivo selecionado é maior do que 10 MB. Por favor, selecione uma imagem menor!",
    });
    return;
  }

  if (!selectedFile.type.includes("image")) {
    SendNotification("warning", {
      duration: 3,
      placement: "bottomRight",
      message:
        "O arquivo selecionado não é uma imagem válida. Por favor, selecione uma imagem!",
    });
    return;
  }

  inputData.profilePhoto = selectedFile;
}

async function handleSaveUserData() {
  console.log("Handle Save User Click", inputData);

  // Validation
  const inputIsValid = await v$.value.$validate();
  if (!inputIsValid) return;

  saveImageIsLoading.value = true;

  await UserService.editUserProfile(
    inputData.id,
    inputData.name,
    inputData.description,
    inputData.profilePhoto
  )
    .then((response) => {
      console.log("Save User Data Successful: ", response);

      SendNotification("success", {
        duration: 3,
        placement: "bottomRight",
        message: "Seu perfil foi alterado com sucesso!",
      });

      emit("update");
    })
    .catch((error) => {
      console.log("Save User Data Error: ", error);

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
            "Erro interno ao alterar os dados do seu perfil, tente novamente.",
        });
      }
    });

  saveImageIsLoading.value = false;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.edit-profile-modal {
  .modal__content {
    width: 100%;
    display: flex;
    flex-direction: column;

    gap: 35px;

    .content__option-row {
      width: 100%;

      gap: 15px;

      display: grid;
      grid-template-columns: 1fr 7fr;
      align-items: center;

      &.--flex {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        gap: 0px;
      }
    }

    .content__option-column {
      width: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      gap: 5px;

      img {
        width: 150px;
        height: 150px;
        object-fit: cover;

        border-radius: 50%;
        border: 1px solid $placeholder-color;
      }
    }

    .option-row__data {
      font-size: 16px;
      font-weight: semi-bold;
    }

    .option-row__title {
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
