<template>
  <BeforeAuthContainer class="recover-password-view">
    <BeforeAuthCard class="view__recover-password-card" padding="large">
      <DefaultLogo class="card__logo" />

      <span class="card__subtitle">
        Insira o código enviado no seu e-mail e sua nova senha para recuperar
        sua conta.
      </span>

      <div class="card__input-container">
        <DefaultInput
          placeholder="Código de confirmação"
          v-model="inputData.code"
          :errors="v$.code.$errors"
          @keypress.enter="handleRecoverClick"
        ></DefaultInput>

        <DefaultInputPassword
          placeholder="Nova senha"
          v-model.trim="inputData.password"
          :errors="v$.password.$errors"
          @keypress.enter="handleRecoverClick"
        ></DefaultInputPassword>
      </div>

      <DefaultButton
        size="large"
        shape="round"
        type="primary"
        class="card__recover-btn"
        :loading="recoverIsLoading"
        @click="handleRecoverClick"
        >Alterar senha</DefaultButton
      >
    </BeforeAuthCard>

    <BeforeAuthCard class="view__footer-card" padding="small">
      <span class="footer-card__text">
        Código expirou?
        <a @click="$router.push({ name: 'send-recover-code' })"
          >Enviar novamente</a
        >
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
import DefaultInputPassword from "../general/inputs/DefaultInputPassword.vue";

import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

import AuthService from "@/services/AuthService";

import SendNotification from "@/utils/SendNotification";
import passwordValidator from "@/utils/passwordValidator";

const router = useRouter();
const recoverIsLoading = ref(false);
const inputData = reactive({
  code: "",
  password: "",
});

const vuelidateRules = {
  code: {
    required: helpers.withMessage(
      "Por favor, insira o código de confirmação enviado no e-mail.",
      required
    ),
  },
  password: {
    required: helpers.withMessage("Por favor, insira sua senha.", required),
    passwordValidator: helpers.withMessage(
      "A senha deve ter entre 8 e 20 caracteres e conter letras e números.",
      passwordValidator
    ),
  },
};

const v$ = useVuelidate(vuelidateRules, inputData);

async function handleRecoverClick() {
  console.log("Handle Recover Click", inputData);

  // Validation
  const inputIsValid = await v$.value.$validate();
  if (!inputIsValid) return;

  // Recover Request
  recoverIsLoading.value = true;

  await AuthService.recoverPassword(inputData.code, inputData.password)
    .then((response) => {
      console.log("Recover Successful: ", response);

      SendNotification("success", {
        duration: 3,
        placement: "bottomRight",
        message: "Sua senha foi altera com sucesso, tente fazer login!",
      });

      router.push({ name: "login" });
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
          message: "Erro interno ao alterar sua senha, tente novamente.",
        });
      }
    });

  recoverIsLoading.value = false;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.recover-password-view {
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
