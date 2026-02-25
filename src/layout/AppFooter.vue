<script setup lang="ts">
</script>
<template>
  <div class="layout-footer">&copy; {{ new Date().getFullYear() }} Jooneli Inc.</div>
</template>
<style scoped>
  .layout-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 0 1rem 0;
      gap: 0.5rem;
      border-top: 1px solid var(--surface-border);
  }
</style>
