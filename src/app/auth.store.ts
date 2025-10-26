import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { API_ROUTES, client } from "./api";

const TOKEN_STORE_KEY = "token-store";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const token = ref<string>();
  const error = ref<string | undefined>();
  const isLoading = ref<boolean>(false);

  const isAuthenticated = computed(() => !!token.value);

  const initialValue = localStorage.getItem(TOKEN_STORE_KEY);
  if (initialValue) {
    token.value = initialValue;
  }

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem(TOKEN_STORE_KEY, newToken);
  };

  const clearToken = () => {
    token.value = undefined;
    localStorage.removeItem(TOKEN_STORE_KEY);
  };

  const getToken = computed(() => token.value);

  const login = (username: string, password: string) => {
    error.value = undefined;
    isLoading.value = true;

    client()
      .post<{ token: string }>(API_ROUTES.login, {
        username,
        password,
      })
      .then((response: AxiosResponse) => {
        setToken(response.data.token);
        isLoading.value = false;
        router.push({ name: "myTickets" });
      })
      .catch(() => {
        isLoading.value = false;
        error.value = "Неверный логин или пароль. Проверьте введенные данные и попробуйте снова";
      });
  };

  const register = (username: string, password: string) => {
    error.value = undefined;
    isLoading.value = true;

    client()
      .post<{ token: string }>(API_ROUTES.register, {
        username,
        password,
      })
      .then(() => {
        return login(username, password);
      })
      .then(() => {
        isLoading.value = false;
      })
      .catch(() => {
        isLoading.value = false;
        error.value = "Ошибка при регистрации. Возможно, такой пользователь уже существует";
      });
    error.value = undefined;
  };

  const logout = () => {
    clearToken();
    router.push("/movies");
  };

  return {
    // State
    isLoading,
    error,
    // Computed
    getToken,
    isAuthenticated,
    // Actions
    login,
    register,
    logout,
    setToken,
    clearToken,
  };
});
