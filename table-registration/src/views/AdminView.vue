<script setup>
import { useAuthUserStore } from "../stores/users";
import GuestList from "../components/GuestList.vue";
import RegistrationList from "../components/RegistrationList.vue";
const userStore = useAuthUserStore();

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
    <GuestList :adminView="true" />
    <RegistrationList :adminView="true" />
  </main>
</template>
