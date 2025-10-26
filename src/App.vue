<script setup lang="ts">
  import { computed } from "vue";

  import { useAuthStore } from "@/app/auth.store";
  import { routes } from "@/app/routes";

  const authStore = useAuthStore();

  const navigation = computed(() => {
    const items = [
      { link: routes.root, title: "Фильмы" },
      { link: routes.cinemas, title: "Кинотеатры" },
    ];

    if (authStore.isAuthenticated) {
      items.push({ link: routes.myTickets, title: "Мои билеты" });
    } else {
      items.push({ link: routes.login, title: "Вход" });
    }

    return items;
  });
</script>

<template>
  <div id="app">
    <nav
      class="main-nav"
      aria-label="Основная навигация"
    >
      <router-link
        v-for="item in navigation"
        :key="item.title"
        :to="item.link"
        class="nav-link"
      >
        {{ item.title }}
      </router-link>
      <button
        v-if="authStore.isAuthenticated"
        class="nav-link"
        @click="authStore.logout()"
      >
        Выйти
      </button>
    </nav>

    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss">
  .main {
    margin: 0 5%;
    padding: 1rem;
    width: 100%;
  }

  nav {
    width: 12rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  button {
    border-radius: 0;
  }

  .nav-link {
    color: var(--color-main);
    text-decoration: none;
    font-size: 1.1rem;
    padding: 0.5rem 1rem;

    border: 1px solid transparent;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--bg-active);
      border-color: var(--color-second);
    }

    &.router-link-active {
      background-color: var(--bg-active);
    }
  }
</style>
