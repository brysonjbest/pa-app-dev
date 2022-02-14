<template>
  <div>

    <!-- Contact acknowledgment -->
    <b-card bg-variant="light" class="mb-3">
      <b-form-group
        id="input-group-contact-acknowledgment"
        label="Contact Acknowledgment"
        label-for="input-contact-acknowledgment"
        label-size="lg"
        label-class="font-weight-bold pt-0"
        class="mb-4"
      >
        <b-card bg-variant="grey" class="mb-2">
          <slot name="overview">
            <p>If your nomination is selected as a finalist, the process is a time commitment for the finalist group involving approximately 20 hours to coordinate video filming schedules, organize interviewees and b-roll, and communicate frequently with the Premier’s Awards team. Please indicate below that the potential finalist group for this nomination is aware of their nomination, and of the potential time commitment should they be selected as a finalist.</p>
          </slot>

          <b-form-checkbox
            :disabled="submitted"
            id="input-contact-acknowledgment"
            v-model="acknowledgment"
            value="accepted"
            unchecked-value="not_accepted"
            :state="validation"
          >Yes, they have been informed</b-form-checkbox>
          <b-form-invalid-feedback :state="validation">
            The contact acknowledgment is required.
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="validation">
            Your contact has acknowledged the nomination.
          </b-form-valid-feedback>
        </b-card>
      </b-form-group>
    </b-card>

  </div>
</template>

<script>

export default {
  name: "acknowledgment-input",
  computed: {
    validation() {
      return this.$store.getters.getValidation.acknowledgment
    },
    submitted() {
      return this.$store.getters.getNomination.submitted
    },
    acknowledgment: {
      get () {
        return this.$store.getters.getNomination.acknowledgment
      },
      set (value) {
        this.$store.dispatch("setNomination", {acknowledgment: value})
      }
    }
  }
}

</script>
