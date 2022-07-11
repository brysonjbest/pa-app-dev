<script setup>
import { useAuthUserStore } from "../stores/users";
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
  </main>
</template>
