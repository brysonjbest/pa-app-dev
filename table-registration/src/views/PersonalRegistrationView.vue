<script setup>
import GuestList from "../components/GuestList.vue";
import RegistrationList from "../components/RegistrationList.vue";
import InputFinancial from "../components/inputs/InputFinancial.vue";
import InputGuest from "../components/inputs/InputGuest.vue";
import PageHeader from "../components/common/PageHeader.vue";
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const props = defineProps({ id: String });
const registration = props.id;

const userStore = useAuthUserStore();
userStore.login();
const financialStore = useFinancialStore();

financialStore.fill(registration);

const tableCount = () => {
  return String(financialStore.getTableCount);
};

const getRegistrar = () => {
  return financialStore.getRegistrar;
};

const registrarName = getRegistrar();

const addGuestDialog = ref(false);
const tableInfoDialog = ref(false);

//Dialog controls
const addGuest = (prod) => {
  addGuestDialog.value = true;
};

const tableInfo = (prod) => {
  tableInfoDialog.value = true;
};

const hideDialog = () => {
  addGuestDialog.value = false;
};
</script>

<template>
  <main>
    <Card
      ><template #header> Submitted by {{ getRegistrar() }} </template>
      <template #title> Registration # {{ registration }} </template>
    </Card>

    <RegistrationList :registrationID="registration" :detailsView="false" />
    <Button
      label="Add Guests"
      icon="pi pi-pencil"
      class="p-button-rounded p-button-success mr-2"
      @click="addGuest()"
    />
    <Button
      type="button"
      label="Tables"
      icon="pi pi-ticket"
      class="p-button-warning"
      :badge="tableCount()"
      @click="tableInfo()"
      badgeClass="p-badge-danger"
    />
    <Dialog
      v-model:visible="tableInfoDialog"
      header="Table Information"
      :modal="true"
      class="p-fluid"
      >Warning regarding table charges. Current table count: {{ tableCount() }}
    </Dialog>

    <Dialog
      v-model:visible="addGuestDialog"
      header="Add a new Guest"
      :modal="true"
      class="p-fluid"
      ><InputGuest :registrationID="registration"
    /></Dialog>
    <GuestList :adminView="false" :registrationID="registration" />
  </main>
</template>
