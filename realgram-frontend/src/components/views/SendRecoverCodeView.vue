<template>
  <BeforeAuthContainer class="send-recover-code-view">
    <BeforeAuthCard class="view__recover-password-card" padding="large">
      <DefaultLogo class="card__logo" />

      <span class="card__subtitle">
        Insira o seu endereço de email e enviaremos um código de confirmação
        para você criar uma nova senha.
      </span>

      <div class="card__input-container">
        <DefaultInput
          placeholder="Email"
          v-model="inputData.email"
          :errors="v$.email.$errors"
          @keypress.enter="handleRecoverClick"
        ></DefaultInput>
      </div>

      <DefaultButton
        size="large"
        shape="round"
        type="primary"
        class="card__recover-btn"
        :loading="recoverIsLoading"
        @click="handleRecoverClick"
        >Enviar código</DefaultButton
      >
    </BeforeAuthCard>

    <BeforeAuthCard class="view__footer-card" padding="small">
      <span class="footer-card__text">
        Lembrou da sua uma conta?
        <a @click="$router.push({ name: 'login' })">Conecte-se</a>
      </span>
    </BeforeAuthCard>
  </BeforeAuthContainer>
</template>

<script setup lang="ts">
import BeforeAuthContainer from "@/components/general/containers/BeforeAuthContainer.vue";
import BeforeAuthCard from "@/components/general/cards/BeforeAuthCard.vue";
import DefaultLogo from "@/components/general/icons/DefaultLogo.vue";
import DefaultInput from "@/components/general/inputs/DefaultInput.vue";
import DefaultButton from "@/components/general/buttons/DefaultButton.vue";

import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required, email } from "@vuelidate/validators";

import AuthService from "@/services/AuthService";

import SendNotification from "@/utils/SendNotification";

const router = useRouter();
const recoverIsLoading = ref(false);
const inputData = reactive({
  email: "",
});

const vuelidateRules = {
  email: {
    required: helpers.withMessage(
      "Por favor, insira seu endereço de e-mail.",
      required
    ),
    email: helpers.withMessage(
      "Por favor, insira um endereço de e-mail válido.",
      email
    ),
  },
};

const v$ = useVuelidate(vuelidateRules, inputData);

async function handleRecoverClick() {
  console.log("Handle Recover Click");

  // Validation
  const inputIsValid = await v$.value.$validate();
  if (!inputIsValid) return;

  // Recover Request
  recoverIsLoading.value = true;

  await AuthService.sendRecoverPasswordCode(inputData.email)
    .then((response) => {
      console.log("Recover Successful: ", response);

      SendNotification("success", {
        duration: 3,
        placement: "bottomRight",
        message: "Código de confirmação enviado com sucesso!",
      });

      router.push({ name: "recover-password" });
    })
    .catch((error) => {
      console.log("Recover Error: ", error);

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
            "Erro interno ao enviar código de confirmação, tente novamente.",
        });
      }
    });

  recoverIsLoading.value = false;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.send-recover-code-view {
  .view__recover-password-card {
    width: 35vw;
    max-width: 400px;

    display: flex;
    flex-direction: column;

    gap: 26px;

    .card__logo {
      margin: auto;
    }

    .card__subtitle {
      font-size: 14px;
      font-weight: 500;
      color: $placeholder-color;

      text-align: center;
    }

    .card__input-container {
      width: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .card__recover-btn {
      margin-top: 12px;
    }
  }

  .view__footer-card {
    width: 35vw;
    max-width: 400px;

    display: flex;
    align-items: center;
    justify-content: center;

    .footer-card__text {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;

      color: $black;

      a {
        color: $primary-blue-two;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
