<template>
  <div>
    <b-container>
      <b-row style="height: 200px" class="text-center" align-v="center">
        <b-col>
          <b-button
            v-if="this.$store.getters.isError"
            class="m-2"
            type="button"
            @click="reroute(`/`)"
          >Return to Nominations</b-button>
          <b-alert v-else show variant="secondary">Please wait while the nomination is initialized...</b-alert>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'nomination-create',
  methods: {
    async reroute(uri) {
      await this.$router.push(uri)
    }
  },
  async beforeCreate() {
    // create new nomination
    this.$store.dispatch('createNomination', {
      category: this.$route.name,
      settings: this.$store.getters.getSettings,
      guid: this.$store.getters.getUser.guid,
    })
      .then(data => {
        // redirect to initialized nomination form
        if (data) this.$router.push(`/edit/${data.year}/${data.category}/${data.id}`)
      })
      .catch(err => {
        console.error(err)
        this.$store.dispatch('handleError',
          {text: 'Nomination could not be created. Please contact the site administrator for assistance', type: 'danger'}
        )
      })
  }
}
</script>
