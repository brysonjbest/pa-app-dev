<script setup>
import UserRegistration from "../components/UserRegistration.vue";

const props = defineProps({ update: Boolean });
const editMode = props.update || false;
console.log(props);
</script>

<template>
  <main>
    <UserRegistration :edit="editMode" />
  </main>
</template>
