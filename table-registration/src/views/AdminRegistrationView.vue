<script setup>
import { useAuthUserStore } from "../stores/users";
import RegistrationList from "../components/RegistrationList.vue";
import NavMenu from "../components/common/NavMenu.vue";
const userStore = useAuthUserStore();

const navItems = [
  {
    label: "Registrations",
    to: "/admin",
  },
  {
    label: "Guests",
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
    <NavMenu :title="''" :menuitems="navItems" />
    <RegistrationList :adminView="true" />
  </main>
</template>
