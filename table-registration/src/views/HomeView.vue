<template>
  <main>
    <Card
      ><template #header> Welcome </template>
      <template #title> Premier's Awards Event Registration </template></Card
    >

    <div v-if="() => isRegistrar">
      <Card>
        <template #content
          >You are logged in as
          <b>{{ userStore.getUser.username }}</b></template
        >
      </Card>
    </div>
    <div v-else>
      <p>
        This event registration tool is restricted to authorized registrars. To
        request access, please register.
      </p>
      <router-link to="/register/">
        <Button block variant="info"> Register as an Event Registrar </Button>
      </router-link>
    </div>

    <div v-if="() => isRegistrar">
      <div>
        <Card title="Event Registration">
          <template #title>
            Premier's Awards {{ year }} Event Registration
          </template>
          <template #content>
            <router-link to="/create/registration/">
              <Button block variant="info"> Register </Button>
            </router-link></template
          ></Card
        >
      </div>
    </div>
  </main>
</template>

<script setup>
import { useAuthUserStore } from "../stores/users";
import { ref } from "vue";
import router from "../router/index.js";
import settings from "../services/settings.services";

const userStore = useAuthUserStore();
const isLoggedIn = userStore.isAuthenticated;
const isRegistrar = userStore.isRegistrar;
const user = userStore.getUser;
const year = ref(settings.get("year") || "");

const reroute = async function (uri) {
  await router.push(uri);
};

//userStore.login();
</script>
