<script setup>
import { useAuthUserStore } from "../stores/users";
import GuestList from "../components/GuestList.vue";
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
  </main>
</template>
