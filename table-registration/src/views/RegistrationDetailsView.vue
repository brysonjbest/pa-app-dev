<script setup>
import GuestList from "../components/GuestList.vue";
import RegistrationList from "../components/RegistrationList.vue";
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";

const props = defineProps({ id: String });
const registration = props.id;
const userStore = useAuthUserStore();
const financialStore = useFinancialStore();

userStore.login();
</script>

<template>
  <main>
    <h1>Registration # {{ registration }}</h1>
    <RegistrationList :registrationID="registration" :detailsView="true" />
    <GuestList :adminView="false" :registrationID="registration" />
  </main>
</template>
