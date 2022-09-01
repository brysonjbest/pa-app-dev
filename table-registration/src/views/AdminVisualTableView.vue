<script setup>
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { useTablesStore } from "../stores/tables";
import { ref } from "vue";
import PageHeader from "../components/common/PageHeader.vue";
import RegistrationList from "../components/RegistrationList.vue";
import NavMenu from "../components/common/NavMenu.vue";
import TableVisual from "../components/TableVisual.vue";
import formServices from "../services/settings.services";
import RegistrationVisual from "../components/RegistrationVisual.vue";

const userStore = useAuthUserStore();
const financialStore = useFinancialStore();

const navItems = ref(formServices.get("navItems") || []);

const tableCountAll = () => {
  return String(useTablesStore().getTablesCount);
};

//PrimeDialog controls

const tableInfoDialog = ref(false);

const tableInfo = () => {
  tableInfoDialog.value = true;
};

const keyCount = ref(0);
const keyAdd = () => keyCount.value++;

userStore.login();
</script>

<template>
  <main>
    <PageHeader title="Event Planning" subtitle="Visually Organize PA Event" />
    <PrimeButton
      label="Table Count: "
      type="button"
      icon="pi pi-ticket"
      class="p-button-warning"
      :badge="tableCountAll()"
      @click="tableInfo()"
      badgeClass="p-badge-danger"
    />
    <NavMenu :title="''" :menuitems="navItems" />

    <TableVisual :key="keyCount" />

    <RegistrationVisual
      v-on:addGuest="keyAdd"
      class="registrations-visual-box"
    />
  </main>
</template>

<style lang="scss" scoped>
.registrations-visual-box {
  display: flex;
  justify-content: center;
}
</style>
