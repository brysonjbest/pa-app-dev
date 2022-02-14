<template>
  <div>

    <RedirectButton
      label="Return to Manage Users"
      :show="done"
      uri="/admin/user/list"
    />

    <b-card id="user-delete" title="Delete User" v-if="validation">
      <p class="my-4">Delete this admin user?</p>
      <b-table
        stacked :items="[user]"
        :fields="['role', 'username', 'firstname', 'lastname']">
      </b-table>
      <b-card-footer align="center">
        <b-button
          :disabled="!validation || done"
          class="m-2"
          type="button"
          @click="remove()"
        >Delete</b-button>
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

export default {
  name: 'user-delete',
  components: {
    RedirectButton
  },
  data () {
    return {
      user: {},
      done: false
    }
  },
  computed: {
    validation() {
      return !!this.user.id
    }
  },
  methods: {
    lookup(key, item) {
      return formServices.lookup(key, item)
    },
    async remove () {
      const guid = this.$route.params.guid || '';
      this.$store.dispatch('removeUser', guid)
        .catch(err => {
          console.error(err)
          this.$store.dispatch('handleError',
            {text: 'User could not be deleted.', type: 'danger'}
          )
        }).finally(()=>{this.done = true})
    },
    async reroute(uri) {
      await this.$router.push(uri)
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
