<!-- PageHeader Common Component -->
<template>
  <div>
    <PrimeCard class="text-3xl">
      <template #header>{{ header }}</template>
      <template #title>{{ title }}</template>
      <template #subtitle>{{ subtitle }}<slot></slot></template>
      <template #content>{{ content }}</template>
      <template #footer>{{ footer }}</template>
    </PrimeCard>
  </div>
</template>

<script>
export default {
  props: {
    header: String,
    title: String,
    subtitle: String,
    content: String,
    footer: String,
  },
};
</script>

<style scoped>
.p-card {
  background-color: #e8ecef;
  color: #2b3e50;
}
</style>
