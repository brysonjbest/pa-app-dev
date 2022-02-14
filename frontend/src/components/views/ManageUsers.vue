<template>
  <div v-if="isAdmin">
    <pageheader header="Manage Users" lead="" />
    <b-container>
      <b-row v-if="loading" class="vh-50 text-center" align-v="center">
        <b-col id="spinner"><b-spinner label="Loading..."></b-spinner></b-col>
      </b-row>
    </b-container>
    <b-table
      ref="user-list"
      primary-key="id"
      :items="items"
      :fields="fields"
      striped
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      responsive="sm"
      :busy.sync="loading"
    >
      <template #cell(role)="row">
        {{ lookup('roles', row.item.role) }}
      </template>

      <template #cell(created)="row">
        {{ row.item.created.toLocaleString() }}
      </template>

      <template #cell(updated)="row">
        {{ row.item.updated.toLocaleString() }}
      </template>

      <template #cell(details)="row">
        <div>
          <b-button
            v-if="row.item.role === 'inactive'"
            size="sm"
            class="m-1"
            @click="activate(row.item.guid)"
            variant="success"
          >
            Activate
          </b-button>
          <b-button
            v-if="isSuperAdmin && !selfAssignment(row.item.guid)"
            size="sm"
            class="m-1"
            @click="reroute(`/admin/user/assign/${row.item.guid}`)"
          >
            Assign
          </b-button>
          <b-button
            v-if="row.item.role !== 'inactive'"
            size="sm"
            class="m-1"
            @click="reroute(`/admin/user/edit/${row.item.guid}`)"
          >
            Edit
          </b-button>
          <b-button
            v-if="row.item.role !== 'inactive'"
            size="sm"
            class="m-1"
            @click="reroute(`/admin/user/delete/${row.item.guid}`)"
          >
            Delete
          </b-button>
        </div>
      </template>

    </b-table>

  </div>
</template>

<script>

import formServices from '@/services/settings.services'
import pageheader from '@/components/common/PageHeader'
import app from '@/services/api.services'

export default {
  name: 'user-list',
  components: {pageheader},
  data () {
    return {
      loading: false,
      error: false,
      message: '',
      sortBy: 'username',
      sortDesc: true,
      items: [],
      fields: [
        {key: 'role', sortable: true},
        {key: 'username', sortable: true},
        {key: 'firstname', sortable: true},
        {key: 'lastname', sortable: true},
        {key: 'email', sortable: true},
        {key: 'created', sortable: true},
        {key: 'details', label:'', sortable: false}
      ]
    }
  },
  computed: {
    settings () {
      return this.$store.getters.getSettings
    },
    isAdmin () {
      return this.$store.getters.isAdmin
    },
    isSuperAdmin () {
      return this.$store.getters.isSuperAdmin
    },
    selfAssignment() {
      return (guid) => {
        const currentUser = this.$store.getters.getUser;
        return guid === currentUser.guid;
      }
    }
  },
  methods: {
    async load () {
      try {
        this.loading = true
        this.items = await this.$store.dispatch('getUsers')
        this.loading = false
      }
      catch (err) {
        this.loading = false
        console.warn(err)
        await this.$store.dispatch('handleError', {
          text: 'An error occurred. Users could not be retrieved',
          type: 'danger'
        })
      }
    },
    async activate (guid) {
      try {
        await this.$store.dispatch('setMessage', {
          text: 'Activating user...',
          type: 'info',
          spinner: true
        })
        await app.get(`users/activate/${guid}`)
        await this.load()
        await this.$store.dispatch('setMessage', {
          text: 'User now activated as a nominator!',
          type: 'success'
        })
      } catch (err) {
        console.error(err);
        await this.$store.dispatch('handleError', {
          text: 'User could not be activated as a nominator.',
          type: 'danger'
        })
      }
    },
    lookup(key, value) {
      return formServices.lookup(key, value)
    },
    async reroute(uri) {
      await this.$router.push(uri)
    }
  },
  beforeMount () {
    this.load()
  }
}
</script>
