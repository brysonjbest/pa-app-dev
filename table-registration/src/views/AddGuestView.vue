<script setup>
import InputGuest from "../components/inputs/InputGuest.vue";
import GuestList from "../components/GuestList.vue";
</script>

<template>
  <main>
    <InputGuest />
    <GuestList :adminView="false" />
  </main>
</template>
