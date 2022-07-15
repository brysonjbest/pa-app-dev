<script setup>
import GuestList from "../components/GuestList.vue";
import RegistrationList from "../components/RegistrationList.vue";
import InputFinancial from "../components/inputs/InputFinancial.vue";
import InputGuest from "../components/inputs/InputGuest.vue";
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const props = defineProps({ id: String });
const registration = props.id;

const userStore = useAuthUserStore();
userStore.login();
const financialStore = useFinancialStore();

// const registration = props.id.toUpperCase() === props.id ? props.id : financialStore.getGuid;
financialStore.fill(registration);

const addGuestDialog = ref(false);

//Dialog controls
const addGuest = (prod) => {
  addGuestDialog.value = true;
};

const hideDialog = () => {
  addGuestDialog.value = false;
};
</script>

<template>
  <main>
    <h1>Registration # {{ registration }}</h1>
    <RegistrationList :registrationID="registration" :detailsView="false" />
    <Button
      label="Add Guests"
      icon="pi pi-pencil"
      class="p-button-rounded p-button-success mr-2"
      @click="addGuest()"
    />

    <Dialog
      v-model:visible="addGuestDialog"
      :style="{ width: '450px' }"
      header="Registration Details"
      :modal="true"
      class="p-fluid"
      ><InputGuest :registrationID="registration"
    /></Dialog>
    <GuestList :adminView="false" :registrationID="registration" />
  </main>
</template>
