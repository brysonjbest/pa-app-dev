<script>
import { ref } from "vue";
import { useAuthUserStore } from "./stores/users";

export default {
  setup() {
    const userStore = useAuthUserStore();
    const user = userStore.getUser || null;
    const username = user.username;
    const menu = ref();

    const siteNav = ref([
      {
        label: "Home",
        to: "/",
      },
      {
        label: "Test",
        to: "/test",
      },
      {
        label: "About",
        url: "https://premiersawards.gww.gov.bc.ca/",
      },
      {
        label: () => userStore.getUser.username || "Account",
        // label: username || "Account",
        class: "dropdown-account",
        icon: "pi pi-user",
        items: [
          {
            label: "Create Account",
            to: "/register/",
            visible: () => !userStore.isAuthenticated,
            class: "dropdown-account-item",
          },
          {
            label: "Login",
            to: "/login/",
            visible: () => !userStore.isAuthenticated,
            class: "dropdown-account-item",
          },
          {
            label: "My Registration",
            to: "/create/registration/",
            visible: () => userStore.isAuthenticated,
            class: "dropdown-account-item",
          },
          {
            label: "Update Profile",
            to: "/user/update/",
            visible: () => userStore.isAuthenticated,
            class: "dropdown-account-item",
          },
          {
            label: "Manage Users",
            to: "/admin/user/list",
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "View Registrations",
            to: "/admin/",
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "View Guests",
            to: "/admin/guests",
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
        ],
      },
    ]);

    userStore.login();

    return { siteNav, username, menu };
  },
};
</script>

<template>
  <header>
    <div>
      <Menubar id="navbar" :model="siteNav">
        <template #start>
          <router-link to="/" id="page-title"
            >Premier's Awards Event Registration
          </router-link>
        </template>
      </Menubar>
    </div>
  </header>

  <RouterView />
</template>

<style>
/* @import "@/assets/base.css"; */
@import "primevue/resources/primevue.min.css";
@import "primeicons/primeicons.css";
@import "/node_modules/primeflex/primeflex.css";

/* Theme Choices: */

/* @import "primevue/resources/themes/nova/theme.css"; */

/* @import "primevue/resources/themes/nova-alt/theme.css"; */

/* @import "primevue/resources/themes/nova-accent/theme.css"; */

/* @import "primevue/resources/themes/nova-vue/theme.css"; */

@import "primevue/resources/themes/rhea/theme.css";

/* @import "primevue/resources/themes/lara-light-teal/theme.css"; */

#app {
  /* max-width: 1280px; */
  margin: 0 auto;
  /* padding: 2rem; */

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

#navbar {
  position: sticky;
  color: white !important;
  background-color: #343a40;
  top: 0;
}

#page-title {
  color: white !important;
  z-index: 9999 !important;
}

.p-menuitem-text {
  color: white !important;
}

.dropdown-account {
  position: absolute !important;
  right: 10px;
  z-index: 9999 !important;
}

.dropdown-account-item .p-menuitem-text {
  color: #343a40 !important;
  z-index: 9999 !important;
}

/*
.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
