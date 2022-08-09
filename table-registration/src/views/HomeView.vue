<template>
  <main>
    <PageHeader
      title="Welcome"
      subtitle="Premier's Awards Event Registration"
    />
    <div v-if="isRegistrar()">
      <PrimeCard>
        <template #content
          >You are logged in as
          <b>{{ userStore.getUser.username }}</b></template
        >
      </PrimeCard>
    </div>
    <div v-else>
      <p>
        This event registration tool is restricted to authorized registrars.
        Please contact your organization's representative to request attendance.
        If you are your organization's representative and wish to register a
        group for attendance, please create an account at the link below.
      </p>
      <router-link to="/register/">
        <PrimeButton block variant="info">
          Create a profile to register attendees for the Premier's Awards
          {{ year }} Event.
        </PrimeButton>
      </router-link>
    </div>

    <div v-if="isRegistrar()">
      <div>
        <PrimeCard title="Event Registration">
          <template #title>
            Premier's Awards {{ year }} Event Registration
          </template>
          <template #content>
            <router-link to="/create/registration/">
              <PrimeButton block variant="info"> Register </PrimeButton>
            </router-link></template
          ></PrimeCard
        >
      </div>
    </div>
  </main>
</template>

<script setup>
import { useAuthUserStore } from "../stores/users";
import { ref } from "vue";
import settings from "../services/settings.services";
import PageHeader from "../components/common/PageHeader.vue";

const userStore = useAuthUserStore();

const isRegistrar = () => {
  return userStore.isRegistrar;
};

const year = ref(settings.get("year") || "");
</script>
