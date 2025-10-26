<script setup lang="ts">
  import { onMounted } from "vue";

  import { useCinemaStore } from "@/entities/Cinema";
  import Table, { type TableColumn } from "@/widgets/Table";

  const store = useCinemaStore();

  onMounted(() => {
    store.fetchCinemas();
  });

  const columns: TableColumn[] = [
    { title: "Кинотеатр", field: "name" },
    { title: "Адрес", field: "address" },
    { title: "", field: "", type: "link", link: "cinema" },
  ];
</script>

<template>
  <h2>Кинотеатры</h2>
  <p v-if="store.isLoading">
    Загрузка...
  </p>
  <p v-else-if="store.error">
    Ошибка: {{ store.error }}
  </p>
  <p v-else-if="store.cinemas.length === 0">
    Нет доступных кинотеатров
  </p>
  <Table
    v-else
    :columns="columns"
    :rows="store.cinemas"
  />
</template>
