<template>
  <BeforeAuthContainer class="login-view">
    <BeforeAuthCard class="view__login-card" padding="large">
      <DefaultLogo class="card__logo" />

      <div class="card__input-container">
        <DefaultInput
          placeholder="Email"
          v-model="inputData.email"
          :errors="v$.email.$errors"
          @keypress.enter="handleLoginClick"
        ></DefaultInput>
        <DefaultInputPassword
          placeholder="Senha"
          v-model="inputData.password"
          :errors="v$.password.$errors"
          @keypress.enter="handleLoginClick"
        ></DefaultInputPassword>
      </div>

      <DefaultButton
        size="large"
        shape="round"
        type="primary"
        class="card__login-btn"
        :loading="loginIsLoading"
        @click="handleLoginClick"
        >Entrar</DefaultButton
      >

      <div class="card__divider">
        <div class="divider__line"></div>
        <span class="divider__text">OU</span>
        <div class="divider__line"></div>
      </div>

      <DefaultButton
        type="link"
        @click="$router.push({ name: 'recover-password' })"
        >Esqueceu a senha?</DefaultButton
      >
    </BeforeAuthCard>

    <BeforeAuthCard class="view__footer-card" padding="small">
      <span class="footer-card__text">
        Não tem uma conta?
        <a @click="$router.push({ name: 'register' })">Cadastre-se</a>
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
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

import AuthService from "@/services/AuthService";

import SendNotification from "@/utils/SendNotification";
import router from "@/router";
import CacheManager from "@/utils/CacheManager";

const loginIsLoading = ref(false);
const inputData = reactive({
  email: "",
  password: "",
});

const vuelidateRules = {
  email: {
    required: helpers.withMessage(
      "Por favor, insira seu endereço de e-mail.",
      required
    ),
  },
  password: {
    required: helpers.withMessage("Por favor, insira sua senha.", required),
  },
};

const v$ = useVuelidate(vuelidateRules, inputData);

async function handleLoginClick() {
  console.log("Handle Login Click");

  // Validation
  const inputIsValid = await v$.value.$validate();
  if (!inputIsValid) return;

  // Login Request
  loginIsLoading.value = true;

  await AuthService.login(inputData.email, inputData.password)
    .then((response) => {
      console.log("Login Successful: ", response);

      CacheManager.set("__token", response.data.token);

      router.push({ name: "timeline" });
    })
    .catch((error) => {
      console.log("Login Error: ", error);

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
          message: "Erro interno ao realizar login, tente novamente.",
        });
      }
    });

  loginIsLoading.value = false;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.login-view {
  .view__login-card {
    width: 35vw;
    max-width: 400px;

    display: flex;
    flex-direction: column;

    gap: 26px;

    .card__logo {
      margin: auto;
    }

    .card__input-container {
      width: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .card__login-btn {
      margin-top: 12px;
    }

    .card__divider {
      width: 100%;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      gap: 12px;

      .divider__line {
        width: 100%;
        border: 1px solid $border-color;
      }

      .divider__text {
        font-size: 20px;
        font-style: normal;
        font-weight: 400;

        color: $border-color;
      }
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
