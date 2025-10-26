<script setup lang="ts">
  import { type Movie } from "@/entities/Movie";
  import { formattedDuration } from "@/shared/utils/formattedDuration";

  const { movie } = defineProps<{ movie?: Movie }>();
</script>

<template>
  <template v-if="movie">
    <div class="movie">
      <h2>{{ movie.title }}</h2>
      <div class="movie-info">
        <img
          :src="movie.posterImage"
          alt="move-logo"
          loading="lazy"
        >
        <div class="info">
          <p>{{ movie.description }}</p>

          <div class="info-item">
            <dt>Год:</dt>
            <dd>{{ movie.year }}</dd>
          </div>

          <div class="info-item">
            <dt>Продолжительность:</dt>
            <dd>{{ formattedDuration(movie.lengthMinutes) }}</dd>
          </div>

          <div class="info-item">
            <dt>Рейтинг:</dt>
            <dd>{{ movie.rating }}</dd>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    Фильм не найден
  </template>
</template>

<style scoped>
  .movie {
    display: flex;
    flex-direction: column;
  }
  .movie-info {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 5rem;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.1rem;
    text-align: start;
  }
  .info-item {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
  }
  dd {
    margin-left: 0;
  }
</style>
