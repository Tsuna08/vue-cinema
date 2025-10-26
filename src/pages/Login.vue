<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/app/auth.store";
import { routes } from "@/app/routes";
import { Input } from "@/shared";
import { validatePassword, validateUsername } from "@/shared/utils/validation";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const errors = ref<Record<string, string>>({});

const validate = () => {
  errors.value = {};
  const usernameError = validateUsername(username.value);
  const passwordError = validatePassword(password.value);

  if (usernameError) errors.value.username = usernameError;
  if (passwordError) errors.value.password = passwordError;

  return !usernameError && !passwordError;
};

const onSubmit = () => {
  if (!validate()) return;

  authStore.login(username.value, password.value);
};

const goToRegister = () => {
  router.push(routes.register);
};
</script>

<template>
  <div class="page">
    <h2>Вход</h2>
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
        placeholder="Введите пароль"
        type="password"
      />

      <div v-if="authStore.error" class="error-text">
        {{ authStore.error }}
      </div>

      <button type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? "Вход..." : "Войти" }}
      </button>
    </form>

    <p>
      Если у вас нет аккаунта,
      <a class="link" @click="goToRegister">зарегистрируйтесь</a>
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
