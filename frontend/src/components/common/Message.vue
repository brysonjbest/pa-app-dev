<template>
  <div>
    <b-navbar fixed="top" class="p-0 m-0" style="top:60px">
      <b-alert
        class="w-100"
        show
        v-if="message.text"
        :variant="message.type"
        dismissible
      >
        <b-spinner class="ml-3" small v-if="message.spinner" label="Saving..." /> {{message.text}}
      </b-alert>
    </b-navbar>
  </div>
</template>
<script>

export default {
  name: "global-message",
  computed : {
    message () {
      return this.$store.getters.getMessage
    }
  }
};
</script>
