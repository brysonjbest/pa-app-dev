<script setup>
import InputGuest from "../components/inputs/InputGuest.vue";
import TableList from "../components/TableList.vue";
import formServices from "../services/settings.services";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useGuestsStore } from "../stores/guests";
import GuestList from "../components/GuestList.vue";

const { guests } = storeToRefs(useGuestsStore());
//const guestStore = useGuestsStore();
const columns = ref(formServices.get("guestSelection") || []);

const guestStore = useGuestsStore();
//guestStore.fillGuests();
// const guests = guestStore.fillGuests();
</script>

<template>
  <main>
    <InputGuest />
    <TableList :columns="columns" :data="guests" />
    <GuestList />
  </main>
</template>
