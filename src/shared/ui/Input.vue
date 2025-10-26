<script setup lang="ts">
  interface Props {
    title: string;
    placeholder: string;
    className: Record<string, any>;
    error?: string;
    type?: string;
  }
  const data = defineModel<string>();
  const { title, error, className, placeholder, type = "text" } = defineProps<Props>();
</script>

<template>
  <div class="form-group">
    <label>{{ title }}</label>
    <input
      v-model="data"
      :type="type"
      :class="className"
      :placeholder="placeholder"
    >
    <span
      v-if="error"
      class="error-text"
    >{{ error }}</span>
  </div>
</template>

<style scoped>
  .form-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.1rem;
  }

  input {
    width: -webkit-fill-available;
    padding: 8px;
    border: 1px solid var(--color-third);
    background: transparent;
    color: var(--color-third);
    &.error {
      border-color: var(--color-error);
    }
  }
  .error-text {
    color: var(--color-error);
    font-size: 0.875rem;
  }
</style>
