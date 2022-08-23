<script setup>
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { useTablesStore } from "../stores/tables";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import PageHeader from "../components/common/PageHeader.vue";
import RegistrationList from "../components/RegistrationList.vue";
import NavMenu from "../components/common/NavMenu.vue";
import TableList from "../components/TableList.vue";
import InputTable from "../components/inputs/InputTable.vue";
const userStore = useAuthUserStore();
const financialStore = useFinancialStore();
const tableStore = useTablesStore();

const navItems = [
  {
    label: "Registrations",
    to: "/admin",
  },
  {
    label: "Guests",
    to: "/admin/guests",
  },
  {
    label: "Tables",
    to: "/admin/tables",
  },
  {
    label: "Event Planning",
    to: "/admin/tables/event/planning",
  },
];

const tableCountAll = () => {
  return String(tableStore.getTablesCount);
};

const fillTables = () => {
  return tableStore.fillTables();
};

const createTable = (data) => {
  return tableStore.addTable(data);
};

const { table, tables } = storeToRefs(useTablesStore());
const tableColumns = ["guid", "tablename", "tablecapacity"];

const generateDefaultTables = () => {
  return tableStore.generateNewEventTables();
};

//PrimeDialog controls

const tableInfoDialog = ref(false);
const addTableDialog = ref(false);

const tableInfo = () => {
  tableInfoDialog.value = true;
};

const addTable = () => {
  table.value = {};
  addTableDialog.value = true;
};

userStore.login();
</script>

<template>
  <main>
    <PageHeader title="All Tables" subtitle="Manage PA Tables" />
    <PrimeButton
      label="Table Count: "
      type="button"
      icon="pi pi-ticket"
      class="p-button-warning"
      :badge="tableCountAll()"
      @click="tableInfo()"
      badgeClass="p-badge-danger"
    />

    <PrimeButton
      label="Generate Default Layout: "
      type="button"
      icon="pi pi-ticket"
      class="p-button"
      @click="generateDefaultTables()"
    />

    <PrimeButton
      label="Fill Tables: "
      type="button"
      icon="pi pi-ticket"
      class="p-button"
      @click="fillTables()"
    />

    <PrimeButton
      label="Add New Table"
      type="button"
      icon="pi pi-ticket"
      class="p-button-warning"
      @click="addTable()"
      badgeClass="p-badge-danger"
    />

    <PrimeDialog
      v-model:visible="addTableDialog"
      header="Add New Table"
      :modal="true"
      class="p-fluid"
      @hide="fillTables()"
      ><InputTable :adminView="true" />
    </PrimeDialog>

    <PrimeDialog
      v-model:visible="tableInfoDialog"
      header="Table Information"
      :modal="true"
      class="p-fluid"
      >Current approximate table count across all registrations:
      {{ tableCountAll() }}
    </PrimeDialog>
    <NavMenu :title="''" :menuitems="navItems" />
    <TableList :data="tables" :columns="tableColumns" />
  </main>
</template>
