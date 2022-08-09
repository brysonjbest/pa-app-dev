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

<style lang="scss">
.p-card {
  background-color: #e8ecef;
  color: #2b3e50;
  margin-bottom: 1em;
}

.p-card-title {
  font-size: 5px;
}
.p-card-subtitle {
  font-size: 1.5em;
}
.p-card-content {
  font-size: 0.75em;
}

.p-card-footer {
  font-size: 0.55em;
}
</style>
