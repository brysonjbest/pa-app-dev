<template>
  <div>

    <PageHeader header="Manage Nominations" lead="" />

    <b-container>
      <b-row v-if="loading" class="vh-50 text-center" align-v="center">
        <b-col id="spinner"><b-spinner label="Loading..."></b-spinner></b-col>
      </b-row>
    </b-container>

    <b-container>
      <b-row>
        <b-col>
          <b-form-group
            label="Selection Mode:"
            label-for="table-select-mode-select"
            label-cols-md="4"
          >
            <b-form-select
              id="table-select-mode-select"
              v-model="selectMode"
              :options="modes"
              class="mb-3"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col class="mb-2" align="right">
          <span v-if="selected.length > 0"> {{ selected.length }} Item(s) Selected</span>
          <b-button class="m-1" size="sm" @click="selectAllRows">Select All</b-button>
          <b-button class="m-1" size="sm" @click="clearSelected">Clear Selected</b-button>
          <b-button
            :disabled="selected.length === 0"
            class="m-1"
            size="sm"
            @click="exportSelected('pdf')">
            Export PDF
          </b-button>
          <b-button
            :disabled="true"
            class="m-1"
            size="sm"
            @click="exportSelected('csv')">
            Export CSV
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group
            label="Status:"
            label-for="table-select-filter-submitted"
            label-cols-md="3"
          >
            <b-form-select
              id="table-select-filter-submitted"
              v-model="selectStatus"
              :options="statuses"
              class="mb-3"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            label="Category:"
            label-for="table-select-filter-category"
            label-cols-md="3"
          >
            <b-form-select
              id="table-select-filter-category"
              v-model="selectCategory"
              :options="categories"
              class="mb-3"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            label="Organization:"
            label-for="table-select-filter-organization"
            label-cols-md="4"
          >
            <b-form-select
              id="table-select-filter-organization"
              v-model="selectOrganization"
              :options="organizations"
              class="mb-3"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>

    <b-table
      ref="selectableTable"
      primary-key="id"
      :items="items"
      :fields="fields"
      striped
      :filter="criteria"
      :filter-function="applyFilter"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :select-mode="selectMode"
      responsive="sm"
      selectable
      @row-selected="onRowSelected"
      :busy.sync="loading"
    >

      <!-- scoped slot for select state -->
      <template #cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <div class="text-center" aria-hidden="true"><BIconCheckSquare/></div>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>

      <template #cell(status)="row">
        <b-badge :variant="row.item.submitted ? 'success' : 'warning'">
          {{ row.item.submitted ? 'Submitted' : 'Draft' }}
        </b-badge>
      </template>

      <template #cell(category)="row">
        {{ lookup('categories', row.item.category) }}
      </template>

      <template #cell(organization)="row">
        {{ lookup('organizations', row.item.organization) }}
      </template>

      <template #cell(created)="row">
        {{ row.item.created.toLocaleString() }}
      </template>

      <template #cell(updated)="row">
        {{ row.item.updated.toLocaleString() }}
      </template>

      <template #cell(details)="row">
        <b-button
          size="sm"
          class="m-1"
          @click="reroute(`/view/${row.item.id}`)"
        >
          View
        </b-button>
        <b-button
          size="sm"
          class="m-1"
          @click="reroute(`/edit/${settings.year}/${row.item.category}/${row.item.id}`)"
        >
          Edit
        </b-button>
        <b-button
          size="sm"
          class="m-1"
          @click="reroute(`/delete/${row.item.id}`)"
        >
          Delete
        </b-button>
        <b-button
          v-if="row.item.submitted"
          size="sm"
          class="m-1"
          @click="unsubmit(row.item.id)"
        >
          Unsubmit
        </b-button>
      </template>

    </b-table>

    <b-alert v-if="error" show variant="danger">
      A server error occurred. Please contact the site administrator for assistance.
    </b-alert>

    <b-navbar fixed="bottom" align="right">
      <b-alert
        v-if="message.text"
        show="5"
        fade
        dismissible
        :variant="message.type"
        @dismissed="message={text:'', type:''}"
      >
        {{message.text}}
      </b-alert>
    </b-navbar>

  </div>
</template>

<script>

import app from '@/services/api.services'
import { saveAs } from 'file-saver';
import formServices from '@/services/settings.services'
import PageHeader from '@/components/common/PageHeader'
import { BIconCheckSquare } from 'bootstrap-vue'

export default {
  name: 'nominations-admin',
  components: {
    PageHeader,
    BIconCheckSquare
  },
  data () {
    return {
      loading: false,
      error: false,
      message: '',
      sortBy: 'status',
      sortDesc: true,
      modes: ['multi', 'single', 'range'],
      selectMode: 'multi',
      categories: formServices.get('categories'),
      selectCategory: '',
      organizations: formServices.get('organizations'),
      selectOrganization: '',
      statuses: formServices.get('status'),
      selectStatus: '',
      selected: [],
      items: [],
      fields: [
        {key: 'selected', sortable: false},
        {key: 'status', sortable: true},
        {key: 'category', sortable: true},
        {key: 'organization', sortable: true},
        {key: 'updated', sortable: true},
        {key: 'created', sortable: true},
        {key: 'details', label: '', sortable: false}
      ]
    }
  },
  computed: {
    criteria () {
      return {
        status: this.selectStatus,
        category: this.selectCategory,
        organization: this.selectOrganization
      }
    },
    settings () {
      return this.$store.getters.getSettings
    },
    isAdmin () {
      return this.$store.getters.isAdmin
    }
  },
  methods: {
    onRowSelected(items) {
      this.selected = items
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows()
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected()
    },
    exportSelected(format) {
      this.exporter((this.selected || []).map(item => {
        return item.id;
      }), format)
    },
    applyFilter(row) {
      const filterStatus = !this.criteria.status || (
        ( row.submitted && this.criteria.status === 'submitted' )
        || ( !row.submitted && this.criteria.status === 'draft' )
      )
      const filterCategory = !this.criteria.category || row.category === this.criteria.category
      const filterOrganization = !this.criteria.organization
        || row.organization === this.criteria.organization
      return filterStatus && filterCategory && filterOrganization
    },
    load () {
      this.loading = true
      return app.get(`data/view`)
        .then(response => {
          const { data = [] } = response || {}
          this.items = data.map(nomination => {
            const {
              _id=null,
              submitted=false,
              category=null,
              organization='',
              title='',
              nominees=[{}],
              updatedAt=null,
              createdAt=null,
            } = nomination || {}
            const { firstname='', lastname=''} = nominees[0] || {}
            const updatedTS = new Date(updatedAt)
            const createdTS = new Date(createdAt)
            return {
              id: _id,
              submitted: submitted,
              status: submitted ? 'Submitted' : 'Draft',
              category: category,
              organization: organization,
              title: title || `${firstname} ${lastname}`,
              created: createdTS,
              updated: updatedTS,
              data: nomination
            }
          })
          this.loading = false

        }).catch (err => {
          console.error(err);
          this.error = true;
          this.message = {
            text: 'Nominations could not be retrieved.',
            type: 'danger'
          }
          this.loading = false
          return []
        })
    },
    exporter (ids, format) {
      this.message = {
        text: 'Exporting...',
        type: 'info'
      }
      return app.post(
        `data/export/${format}`,
        {
          ids: ids,
          year: this.settings.year
        },
        {responseType: 'blob'}
      )
        .then(res => {
          const timestamp = new Date().getTime();
          saveAs(res.data, `nominations_${timestamp}.zip`);
          this.message = {
            text: 'Export completed successfully!',
            type: 'success'
          }
        }).catch (err => {
          console.error(err)
          this.message = {
            text: 'Export failed.',
            type: 'danger'
          }
          return []
        })
    },
    async unsubmit (id) {
      try {
        this.message = {
          text: 'Unsubmitting nomination...',
          type: 'info'
        }
        // handle data unsubmission
        await app.get(`data/unsubmit/${id}`)
        this.message = {
          text: 'Successfully unsubmitted nomination!',
          type: 'success'
        }
        // reload nominations data
        await this.load()

      } catch (err) {
        console.error(err);
        this.submitting = false
        this.message = {
          text: 'Nomination could not be unsubmitted.',
          type: 'danger'
        }
      }
    },
    async reroute(uri) {
      await this.$router.push(uri)
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
