<script setup>
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { ref } from "vue";
import PageHeader from "../components/common/PageHeader.vue";
import RegistrationList from "../components/RegistrationList.vue";
import NavMenu from "../components/common/NavMenu.vue";
import TableVisual from "../components/TableVisual.vue";
import RegistrationVisual from "../components/RegistrationVisual.vue";
const userStore = useAuthUserStore();
const financialStore = useFinancialStore();

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

userStore.login();
</script>

<template>
  <main>
    <PageHeader title="Event Planning" subtitle="Visually Organize PA Event" />

    <TableVisual />

    <RegistrationVisual />
  </main>
</template>
