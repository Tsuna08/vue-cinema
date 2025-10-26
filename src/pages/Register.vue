<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/app/auth.store";
import { routes } from "@/app/routes";
import { Input } from "@/shared";
import {
  validatePassword,
  validatePasswordConfirmation,
  validateUsername,
} from "@/shared/utils/validation";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const errors = ref<Record<string, string>>({});

const validate = () => {
  errors.value = {};
  const usernameError = validateUsername(username.value);
  const passwordError = validatePassword(password.value);
  const confirmationError = validatePasswordConfirmation(
    password.value,
    passwordConfirmation.value,
  );

  if (usernameError) errors.value.username = usernameError;
  if (passwordError) errors.value.password = passwordError;
  if (confirmationError) errors.value.passwordConfirmation = confirmationError;

  return !usernameError && !passwordError && !confirmationError;
};

const onSubmit = () => {
  if (!validate()) return;

  authStore.register(username.value, password.value);
};

const goToLogin = () => {
  router.push(routes.login);
};
</script>

<template>
  <div class="page">
    <h2>Регистрация</h2>
    <form class="form" @submit.prevent="onSubmit">
      <Input
        v-model="username"
        title="Логин"
        :class-name="{ error: errors.username }"
        :error="errors.username"
        placeholder="Введите логин"
      />
      <Input
        v-model="password"
        title="Пароль"
        :class-name="{ error: errors.password }"
        :error="errors.password"
        type="password"
        placeholder="Введите пароль"
      />
      <Input
        v-model="passwordConfirmation"
        title="Подтверждение пароль"
        :class-name="{ error: errors.password }"
        :error="errors.passwordConfirmation"
        type="password"
        placeholder="Повторите пароль"
      />

      <div v-if="authStore.error" class="error-text">
        {{ authStore.error }}
      </div>

      <button type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? "Регистрация..." : "Зарегистрироваться" }}
      </button>
    </form>

    <p>
      Если вы уже зарегистрированы,
      <a class="link" @click="goToLogin">войдите</a>
    </p>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 25rem;
}

.error-text {
  color: var(--color-error);
  font-size: 0.875rem;
}
</style>
