<template>
  <div>
    <b-sidebar
      v-if="isLoggedIn && isNominator"
      id="sidebar-profile"
      title="Admin Profile"
      backdrop-variant="dark"
      backdrop
      style="z-index: 9999"
      shadow>
        <Profile />
    </b-sidebar>
    <b-navbar fixed="top" toggleable="lg" type="dark" variant="dark" style="z-index: 9990">
      <b-navbar-brand href="/nominations">
        Premier's Awards Nominations
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav type="dark" variant="info">
        <b-navbar-nav>
          <li>
            <router-link class="nav-link" to="/" exact>Home</router-link>
          </li>
          <b-nav-item href="https://premiersawards.gww.gov.bc.ca/">About</b-nav-item>

          <b-nav-item-dropdown v-if="isLoggedIn && isNominator" text="Create Nomination" right>
            <b-dropdown-item>
              <router-link :to="`/create/${settings.year}/emerging-leader/`">Emerging Leader</router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link :to="`/create/${settings.year}/evidence-based-design/`">Evidence-based Design</router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link :to="`/create/${settings.year}/innovation/`">Innovation</router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link :to="`/create/${settings.year}/leadership/`">Leadership</router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link :to="`/create/${settings.year}/legacy/`">Legacy</router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link :to="`/create/${settings.year}/organizational-excellence/`">Organizational Excellence</router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link :to="`/create/${settings.year}/partnership/`">Partnership</router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link :to="`/create/${settings.year}/regional-impact/`">Regional Impact</router-link>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" v-if="isLoggedIn && isNominator">
            <b-nav-item-dropdown right class="btn btn-info text-light p-0">
              <template #button-content>
                  <BIconPerson /> {{user.username}}
              </template>
              <b-dropdown-item v-b-toggle.sidebar-profile v-if="isLoggedIn && isNominator">
                My Profile
              </b-dropdown-item>
              <b-dropdown-item v-if="isAdmin">
                <router-link to="/admin/list">Manage Nominations</router-link>
              </b-dropdown-item>
              <b-dropdown-item v-if="isAdmin">
                <router-link to="/admin/user/list">Manage Users</router-link>
              </b-dropdown-item>
              <b-dropdown-item>
                <router-link to="/list" exact>My Nominations</router-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>

import Profile from '@/components/common/AdminProfile'
import { BIconPerson } from 'bootstrap-vue'

export default {
  name: "navbar",
  components: {
    Profile, BIconPerson
  },
  computed : {
    isLoggedIn () {
      return this.$store.getters.isAuthenticated
    },
    isNominator () {
      return this.$store.getters.isNominator
    },
    isAdmin () {
      return this.$store.getters.isAdmin
    },
    isSuperAdmin () {
      return this.$store.getters.isSuperAdmin
    },
    user () {
      return this.$store.getters.getUser
    },
    settings () {
      return this.$store.getters.getSettings
    }
  }
};
</script>
<style>
.navbar-dark .navbar-nav .nav-link {
  color: white !important;
}
</style>
