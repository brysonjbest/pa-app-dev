<template>
  <div>
    <b-alert :show="selfAssignment" variant="warning">You cannot assign a role to yourself.</b-alert>
    <RedirectButton
      label="Return to Manage Users"
      :show="done || selfAssignment"
      uri="/admin/user/list"
    />
    <b-card id="user-delete" title="Assign User Role" v-if="!selfAssignment">
      <b-table
        stacked :items="[user]"
        :fields="['username', 'firstname', 'lastname']">
      </b-table>
      <b-form-group
        id="input-group-user-assign-role"
        label="Select a User Role"
        label-for="input-user-assign-role"
        label-size="lg"
        label-class="font-weight-bold pt-0"
      >
        <b-form-select
          id="input-user-assign-role"
          v-model="user.role"
          :options="options"
          :state="!!user.role"
        >
        </b-form-select>
        <b-form-invalid-feedback :state="!!user.role">
          This field is required.
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="!!user.role">
          Completed correctly.
        </b-form-valid-feedback>
      </b-form-group>
      <b-card-footer align="center">
        <b-button
          :disabled="!validation || done"
          class="m-2"
          type="button"
          @click="assign()"
        >Assign Role</b-button>
        <b-button
          class="m-2"
          type="button"
          variant="secondary"
          @click="reroute('/admin/user/list')"
        >Return to Manage Users</b-button>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>

import RedirectButton from '@/components/common/RedirectButton'
import formServices from '@/services/settings.services'
import app from '@/services/api.services'

export default {
  name: 'user-assign-role',
  components: {
    RedirectButton
  },
  data () {
    return {
      user: {},
      done: false,
      options: formServices.get('roles')
    }
  },
  computed: {
    validation() {
      return !!this.user.id && this.user.role
    },
    selfAssignment() {
      const currentUser = this.$store.getters.getUser;
      return this.user.guid === currentUser.guid;
    }
  },
  methods: {
    lookup(key, item) {
      return formServices.lookup(key, item)
    },
    async reroute(uri) {
      await this.$router.push(uri)
    },
    async assign () {
      try {
        await this.$store.dispatch('setMessage', {
          text: 'Assigning new user role...',
          type: 'info',
          spinner: true
        })
        await app.post(`users/assign/${this.user.guid}`, {role: this.user.role})
        await this.$store.dispatch('setMessage', {
          text: `User is now assigned role of ${this.user.role}.`,
          type: 'success'
        })
      } catch (err) {
        console.error(err);
        await this.$store.dispatch('handleError', {
          text: 'User role could not be reassigned.',
          type: 'danger'
        })
      }
    }
  },
  async beforeCreate() {
    try {
      this.user = await this.$store.dispatch('getUserById', this.$route.params.guid)
    }
    catch (err) {
      console.error(err)
      await this.$store.dispatch('handleError',
        {text: 'User data failed to load.', type: 'danger'}
      )
    }
  }
}
</script>
