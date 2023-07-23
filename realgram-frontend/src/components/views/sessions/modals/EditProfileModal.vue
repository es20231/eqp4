<template>
  <a-modal
    width="600px"
    okText="Salvar"
    size="large"
    title="Editar perfil"
    class="edit-profile-modal"
  >
    <div class="modal__content">
      <!-- Edit Image -->
      <div class="content__option-column">
        <a-avatar :size="120" :src="inputData.profileImage"></a-avatar>
        <span class="option-row__data">{{ inputData.username }}</span>

        <div class="content__option-row --flex">
          <DefaultButton type="link">Alterar foto do perfil</DefaultButton>
          <DefaultButton danger type="link"
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

import IUserData from "@/interfaces/IUserData";
import { ref } from "vue";

interface Props {
  userData: IUserData;
}

const props = defineProps<Props>();

const inputData = ref<IUserData>(props.userData);
</script>

<style scoped lang="scss">
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
