<script setup>
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { useTablesStore } from "../stores/tables";
import { useMessageStore } from "../stores/messages";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import PageHeader from "../components/common/PageHeader.vue";
import RegistrationList from "../components/RegistrationList.vue";
import NavMenu from "../components/common/NavMenu.vue";
import TableList from "../components/TableList.vue";
import formServices from "../services/settings.services";
import InputTable from "../components/inputs/InputTable.vue";

const userStore = useAuthUserStore();
const financialStore = useFinancialStore();
const tableStore = useTablesStore();
const messageStore = useMessageStore();

const { message } = storeToRefs(useMessageStore());
const activeMessage = ref(false);

const navItems = ref(formServices.get("navItems") || []);

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

const keyCount = ref(0);
const keyAdd = () => keyCount.value++;

const generateDefaultTables = async () => {
  try {
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Generating required tables...",
      type: "info",
      spinner: true,
    });
    // handle data submission
    await tableStore.generateNewEventTables().then(() => {
      messageStore.setMessage({
        text: "Successfully generated tables!",
        type: "success",
      });
    });
  } catch (error) {
    console.error(error);
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Tables could not be generated.",
      type: "error",
    });
  } finally {
    keyAdd();
  }
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
    <PrimeMessage
      show
      v-if="activeMessage"
      :variant="message.type"
      :life="5000"
      :sticky="false"
    >
      <p>
        {{ message.text }}
      </p>
    </PrimeMessage>

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
    <TableList :data="tables" :columns="tableColumns" :key="keyCount" />
  </main>
</template>
