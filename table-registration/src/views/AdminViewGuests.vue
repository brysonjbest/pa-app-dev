<script setup>
import { useAuthUserStore } from "../stores/users";
import GuestList from "../components/GuestList.vue";
import NavMenu from "../components/common/NavMenu.vue";
const userStore = useAuthUserStore();

const navItems = [
  {
    label: "Registrations",
    icon: "pi pi-fw pi-home",
    to: "/admin",
  },
  {
    label: "Guests",
    icon: "pi pi-fw pi-home",
    to: "/admin/guests",
  },
];

userStore.login();

const logout = function () {
  userStore.logout();
};
</script>

<template>
  <main>
    <Button
      label="Logout"
      type="logout"
      class="p-button-raised"
      @click="logout"
    />
    <NavMenu :title="'Admin View'" :menuitems="navItems" />
    <GuestList :adminView="true" />
  </main>
</template>
