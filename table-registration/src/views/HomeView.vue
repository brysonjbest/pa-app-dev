<template>
  <main>
    <PageHeader
      :subtitle="`Welcome to the registration system for the ${settings.year} Premier's Awards.`"
      :content="userGreeting"
    />
    <div v-if="isRegistrar()">
      <router-link to="/create/registration/">
        <PrimeButton block variant="info"> Register </PrimeButton>
      </router-link>
    </div>
    <div v-if="!isRegistrar()">
      <p>
        This event registration tool is restricted to authorized registrars.<br />
        Please contact your organization's representative to request
        attendance.<br />
        If you are your organization's representative and wish to register a
        group for attendance, please create an account at the link below.
      </p>
      <router-link to="/register/">
        <PrimeButton block variant="info">
          Create a profile to register attendees for the Premier's Awards
          {{ settings.year }} Event.
        </PrimeButton>
      </router-link>
    </div>
  </main>
</template>

<script setup>
import { useAuthUserStore } from "../stores/users";
import { ref, computed } from "vue";
import { useSettingsStore } from "../stores/settings";
import PageHeader from "../components/common/PageHeader.vue";
import { storeToRefs } from "pinia";

const userStore = useAuthUserStore();

const isRegistrar = () => {
  return userStore.isRegistrar;
};

const userGreeting = computed(() =>
  isRegistrar() ? `You are logged in as ${userStore.getUser.username}.` : ""
);

const { settings } = storeToRefs(useSettingsStore());
</script>
