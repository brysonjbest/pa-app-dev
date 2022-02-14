<template>
  <div class="mb-3">

    <b-card bg-variant="light" class="mb-3">
      <slot name="overview">
        <div v-if="$props.type === 'multiple'">
          <p>Please include the key nominees and/or partners who contributed to the initiative including only their name and ministry or organization.</p>
          <ul>
            <li><strong>Nominees</strong> are individuals who played a significant role in the initiative, program or project.</li>
            <li><strong>Partners</strong> are internal and/or external organizations that played a significant role in the initiative, program or project.</li>
          </ul>
        </div>
      </slot>

      <b-form-group
        v-for="(nominee, counter) in nominees"
        v-bind:key="counter"
        :label-cols-lg="$props.type === 'multiple' && nominees.length > 1 ? 3 : 0"
        :label="$props.type === 'multiple' && nominees.length > 1 ? `Nominee ${counter + 1}` : ''"
        label-size="lg"
        label-class="font-weight-bold"
        class="mb-4 pb-4 pt-4"
      >
        <b-form-group
          v-if="$props.type === 'multiple'"
          :id="`fieldset-nominees-${counter}-type`"
          label="Nominee Type"
          :label-for="`input-nominees-${counter}-type`"
        >
          <b-form-select
            :id="`input-nominees-${counter}-type`"
            v-model="nominee.type"
            :options="options.types"
            placeholder="Select the nominee type"
            :state="!!nominee.type"
            :disabled="submitted"
          >
          </b-form-select>
          <b-form-invalid-feedback :state="!!nominee.type">
            This field is required.
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="!!nominee.type">
            Completed correctly.
          </b-form-valid-feedback>
        </b-form-group>

        <b-form-group
          :id="`fieldset-nominees-${counter}-firstname`"
          label="First Name"
          :label-for="`input-nominees-${counter}-firstname`"
        >
          <b-form-input
            :id="`input-nominees-${counter}-firstname`"
            v-model="nominee.firstname"
            placeholder="Enter the nominee's given name"
            :state="validate(counter, 'firstname')"
            :disabled="submitted"
          />
          <b-form-invalid-feedback :state="validate(counter, 'firstname')">
            This field is required.
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="validate(counter, 'firstname')">
            Completed correctly.
          </b-form-valid-feedback>
        </b-form-group>

        <b-form-group
          :id="`fieldset-nominees-${counter}-lastname`"
          label="Last Name"
          :label-for="`input-nominees-${counter}-lastname`"
        >
          <b-form-input
            :id="`input-nominees-${counter}-lastname`"
            v-model="nominee.lastname"
            placeholder="Enter the nominee's last name"
            :state="validate(counter, 'lastname')"
            :disabled="submitted"
          >
          </b-form-input>
          <b-form-invalid-feedback :state="validate(counter, 'lastname')">
            This field is required.
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="validate(counter, 'lastname')">
            Completed correctly.
          </b-form-valid-feedback>
        </b-form-group>

        <b-form-group
          v-if="$props.type === 'multiple'"
          :id="`fieldset-nominees-${counter}-organization`"
          label="Organization"
          :label-for="`input-nominees-${counter}-organization`"
        >
          <b-form-select
            :id="`input-nominees-${counter}-organization`"
            v-model="nominee.organization"
            :options="options.organization"
            placeholder="Select the nominee's organization"
            :state="validate(counter, 'organization')"
            :disabled="submitted"
          >
          </b-form-select>
          <b-form-invalid-feedback :state="validate(counter, 'organization')">
            This field is required.
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="validate(counter, 'organization')">
            Completed correctly.
          </b-form-valid-feedback>
        </b-form-group>

        <b-button
          v-if="nominees.length > 1"
          variant="outline-primary"
          @click="removeNominee(counter)"
          :disabled="submitted"
        >
          Remove Nominee
        </b-button>
      </b-form-group>
    </b-card>
    <b-button
      v-if="$props.type === 'multiple'"
      block variant="outline-primary"
      @click="addNominee()"
      :disabled="submitted"
    >
      Add Nominee
    </b-button>
  </div>
</template>

<script>

import formServices from '@/services/settings.services'

const init = { type: null, firstname: '', lastname: '', organization: null }

export default {
  name: "nominees-input",
  props: {
    type: String
  },
  data() {
    return {
      options: {
        types: formServices.get('nomineeTypes'),
        organization: formServices.get('organizations')
      }
    }
  },
  computed: {
    nominees: {
      get () {
        return this.$store.getters.getNomination.nominees;
      },
      set (value) {
        this.$store.dispatch("setNomination", {nominees: value})
      }
    },
    validate(){
      return (id, field) => {
        const fields = {
          firstname: ()=>{
            return this.nominees[id].firstname.length > 0
          },
          lastname: ()=>{
            return this.nominees[id].lastname.length > 0
          },
          title: ()=>{
            return this.nominees[id].title.length > 0
          },
          organization: ()=>{
            return this.nominees[id].organization
          }
        }
        if (fields[field] === 'undefined') return false;
        return !!fields[field]();
      }
    },
    submitted() {
      return this.$store.getters.getNomination.submitted
    }
  },
  methods: {
    addNominee(){
      this.nominees.push(init)
    },
    removeNominee(counter){
      if (this.nominees.length > 1)
        this.nominees.splice(counter,1);
    }
  },
  mounted() {
    // initialize whether single or multiple nominees in validation
    this.$store.dispatch('setValidation', {multipleNominees: this.$props.type === 'multiple'})
  }
};
</script>
