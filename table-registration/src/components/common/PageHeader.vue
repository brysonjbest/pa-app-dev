<template>
  <div>
    <Card>
      <template #header>{{ header }}</template>
      <template #title>{{ title }}</template>
      <template #subtitle>{{ subtitle }}</template>
      <template #content>{{ content }}</template>
      <template #footer>{{ footer }}</template>
    </Card>
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
  setup(props) {
    const { header, title, subtitle, content, footer } = props;
    return {
      header,
      title,
      subtitle,
      content,
      footer,
    };
  },
};
</script>

<style scoped></style>
