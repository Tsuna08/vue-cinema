<script setup lang="ts">
  import { useRouter } from "vue-router";

  import { formattedDuration } from "@/shared/utils/formattedDuration";

  import type { TableColumn } from "../types";

  interface Props {
    columns: TableColumn[];
    rows: any;
  }

  const { columns, rows } = defineProps<Props>();
  const router = useRouter();

  const viewSessions = (movieId: number, link?: string) => {
    if (!link) return;
    router.push({ name: link, params: { id: movieId } });
  };
</script>

<template>
  <table>
    <thead class="header">
      <tr>
        <th
          v-for="column in columns"
          :key="column.field"
        >
          {{ column.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.id"
      >
        <td
          v-for="column in columns"
          :key="column.field"
        >
          <button
            v-if="column.type === 'link'"
            @click="viewSessions(row.id, column.link)"
          >
            Просмотреть сеансы
          </button>
          <img
            v-else-if="column.type === 'image'"
            :src="row[column.field]"
            alt="poster"
            class="poster"
          >
          <template v-else-if="column.type === 'duration'">
            {{ formattedDuration(row[column.field]) }}
          </template>
          <template v-else>
            {{ row[column.field] }}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  .header {
    border-bottom: 1px solid var(--color-second);
  }
  th {
    padding: 8px;
  }
  td {
    padding: 16px 8px;
  }
  .poster {
    width: 150px;
    height: 200px;
    object-fit: cover;
  }
</style>
