<!-- Guest Selector for Tables -->
<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}</PrimeMessage
    >
    <PickList></PickList>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>
<style></style>
