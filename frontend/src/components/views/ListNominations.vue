<template>
  <div>
    <pageheader :header="header" :lead="lead" />
    <b-container>
      <b-row v-if="loading" class="vh-50 text-center" align-v="center">
        <b-col id="spinner"><b-spinner label="Loading..."></b-spinner></b-col>
      </b-row>
    </b-container>

    <b-table
      ref="nominations-list"
      primary-key="id"
      :items="items"
      :fields="fields"
      striped
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      responsive="sm"
      :busy.sync="loading"
    >

      <template #cell(status)="row">
        <b-badge :variant="row.item.submitted ? 'success' : 'warning'">
          {{ row.item.submitted ? 'Submitted' : 'Draft' }}
        </b-badge>
      </template>

      <template #cell(category)="row">
        {{ lookup('categories', row.item.category) }}
      </template>

      <template #cell(created)="row">
        {{ row.item.created.toLocaleString() }}
      </template>

      <template #cell(updated)="row">
        {{ row.item.updated.toLocaleString() }}
      </template>

      <template #cell(details)="row">
        <EditMenu
          :disabled="row.item.submitted"
          :id="row.item.id"
          :category="row.item.category"
          :show="['view', 'edit', 'delete']"
        />
      </template>

    </b-table>

  </div>
</template>

<script>

import formServices from '@/services/settings.services'
import PageHeader from '@/components/common/PageHeader'
import EditMenu from '@/components/common/EditMenu'

export default {
  name: 'nomination-list',
  props: {
    header: String,
    lead: String
  },
  components: {
    pageheader: PageHeader, EditMenu
  },
  data () {
    return {
      loading: false,
      error: false,
      message: '',
      sortBy: 'status',
      sortDesc: true,
      items: [],
      fields: [
        {key: 'status', sortable: true},
        {key: 'category', sortable: true},
        {key: 'organization', sortable: true},
        {key: 'updated', sortable: true},
        {key: 'created', sortable: true},
        {key: 'details', sortable: false}
      ]
    }
  },
  computed: {
    settings () {
      return this.$store.getters.getSettings
    },
    isAdmin () {
      return this.$store.getters.isAdmin
    }
  },
  methods: {
    async load () {
      try {
        this.loading = true
        const {guid = ''} = this.$store.getters.getUser || {}
        this.items = await this.$store.dispatch('getUserNominations', guid)
        this.loading = false
      }
      catch (err) {
        this.loading = false
        console.warn(err)
        await this.$store.dispatch('setMessage', {
          text: 'An error occurred. Nominations could not be retrieved',
          type: 'danger'
        })
    }
    },
    lookup(key, value) {
      return formServices.lookup(key, value)
    }
  },
  beforeMount () {
    this.load()
  }
}
</script>
