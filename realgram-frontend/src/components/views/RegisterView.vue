<template>
  <BeforeAuthContainer class="register-view">
    <BeforeAuthCard class="view__register-card" padding="large">
      <DefaultLogo class="card__logo" />

      <div class="card__input-container">
        <DefaultInput
          placeholder="Nome"
          v-model="inputData.name"
          :errors="v$.name.$errors"
          @keypress.enter="handleRegisterClick"
        ></DefaultInput>

        <DefaultInput
          placeholder="Email"
          v-model="inputData.email"
          :errors="v$.email.$errors"
          @keypress.enter="handleRegisterClick"
        ></DefaultInput>

        <DefaultInput
          placeholder="Nome de usuário"
          v-model="inputData.username"
          :errors="v$.username.$errors"
          @keypress.enter="handleRegisterClick"
        ></DefaultInput>

        <DefaultInputPassword
          placeholder="Senha"
          v-model="inputData.password"
          :errors="v$.password.$errors"
          @keypress.enter="handleRegisterClick"
        ></DefaultInputPassword>
      </div>

      <DefaultButton
        size="large"
        shape="round"
        type="primary"
        class="card__register-btn"
        :loading="registerIsLoading"
        @click="handleRegisterClick"
        >Cadastrar</DefaultButton
      >
    </BeforeAuthCard>

    <BeforeAuthCard class="view__footer-card" padding="small">
      <span class="footer-card__text">
        Tem uma conta?
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
import DefaultInputPassword from "../general/inputs/DefaultInputPassword.vue";

import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required, minLength, email } from "@vuelidate/validators";

import AuthService from "@/services/AuthService";

import SendNotification from "@/utils/SendNotification";
import passwordValidator from "@/utils/passwordValidator";

const router = useRouter();
const registerIsLoading = ref(false);
const inputData = reactive({
  name: "",
  email: "",
  username: "",
  password: "",
});

const vuelidateRules = {
  name: {
    required: helpers.withMessage("Por favor, insira seu nome.", required),
    minLength: helpers.withMessage(
      "O nome deve conter pelo menos 5 caracteres.",
      minLength(5)
    ),
  },
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
  username: {
    required: helpers.withMessage(
      "Por favor, insira um nome de usuário.",
      required
    ),
    minLength: helpers.withMessage(
      "O nome de usuário deve conter pelo menos 4 caracteres.",
      minLength(4)
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

async function handleRegisterClick() {
  console.log("Handle Register Click");

  // Validation
  const inputIsValid = await v$.value.$validate();
  if (!inputIsValid) return;

  // Register Request
  registerIsLoading.value = true;

  await AuthService.register(
    inputData.name,
    inputData.email,
    inputData.username,
    inputData.password
  )
    .then((response) => {
      console.log("Register Successful: ", response);

      SendNotification("success", {
        duration: 3,
        placement: "bottomRight",
        message: "Usuário registrado com sucesso, tente fazer login!",
      });

      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("Register Error: ", error);

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
            "Erro interno ao realizar registro do usuário, tente novamente.",
        });
      }
    });

  registerIsLoading.value = false;
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.register-view {
  .view__register-card {
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

    .card__register-btn {
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
