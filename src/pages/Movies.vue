<script setup lang="ts">
  import { onMounted } from "vue";

  import { useMovieStore } from "@/entities/Movie/model/movie.store";
  import Table, { type TableColumn } from "@/widgets/Table";

  const store = useMovieStore();
  const columns: TableColumn[] = [
    { title: "", field: "posterImage", type: "image" },
    { title: "Название", field: "title" },
    { title: "Продолжительность", field: "lengthMinutes", type: "duration" },
    { title: "Рейтинг", field: "rating" },
    { title: "", field: "", type: "link", link: "movie" },
  ];
  onMounted(() => {
    store.fetchMovies();
  });
</script>

<template>
  <h2>Фильмы</h2>
  <div v-if="store.isLoading">
    Загрузка...
  </div>
  <Table
    v-else
    :columns="columns"
    :rows="store.movies"
  />
</template>
