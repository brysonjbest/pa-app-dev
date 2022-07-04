<!-- Provides initial registration of financial details -->
<template>
  <div>
    <form @submit="onSubmit" @reset="onReset" v-if="show">
      <Dropdown
        id="organization"
        v-model="registration.organization"
        :options="organizations"
        optionLabel="text"
        optionValue="value"
        placeholder="Select a Organization"
      />

      <!-- <form-group id="input-group-branch" label="Branch:" label-for="branch">
        <form-input
          id="branch"
          v-model="registration.branch"
          placeholder="Full name of branch"
          required
        ></form-input>
      </form-group>

      <form-group
        id="input-group-primarycontact"
        label="Primary Contact:"
        label-for="primarycontact"
      >
        <form-input
          id="primarycontact"
          v-model="registration.primarycontact"
          placeholder="Primary contact's full name"
          required
        ></form-input>
      </form-group>

      <form-group
        id="input-group-primaryemail"
        label="Primary Contact's Email Address:"
        label-for="primarycontact"
      >
        <form-input
          id="primaryemail"
          v-model="registration.primaryemail"
          type="email"
          placeholder="Primary contact's email address"
          required
        ></form-input>
      </form-group>

      <form-group
        id="input-group-financialcontact"
        label="Financial Contact:"
        label-for="financialcontact"
      >
        <form-input
          id="financialcontact"
          v-model="registration.financialcontact"
          placeholder="Financial contact's full name"
          required
        ></form-input>
      </form-group>

      <form-group
        id="input-group-clientministry"
        label="Client/Ministry:"
        label-for="clientministry"
      >
        <form-input
          id="clientministry"
          v-model="registration.clientministry"
          placeholder="3 digit number"
          required
          type="number"
          min="100"
          max="999"
          :state="clientMinistryState"
          :no-wheel="true"
        ></form-input>
      </form-group>

      <form-group
        id="input-group-respcode"
        label="Resp Code:"
        label-for="respcode"
      >
        <form-input
          id="respcode"
          v-model="registration.respcode"
          placeholder="5 digit number"
          required
          type="number"
          min="10000"
          max="99999"
          :state="respCodeState"
          :no-wheel="true"
        ></form-input>
      </form-group>

      <form-group
        id="input-group-serviceline"
        label="Service Line:"
        label-for="serviceline"
      >
        <form-input
          id="serviceline"
          v-model="registration.serviceline"
          placeholder="5 digit number"
          required
          type="number"
          min="10000"
          max="99999"
          :state="servicelineState"
          :no-wheel="true"
        ></form-input>
      </form-group>

      <form-group id="input-group-stob" label="STOB:" label-for="stob">
        <form-input
          id="stob"
          v-model="registration.stob"
          placeholder="4 digit number"
          required
          type="number"
          min="1000"
          max="9999"
          :state="stobState"
          :no-wheel="true"
        ></form-input>
      </form-group>

      <form-group id="input-group-project" label="Project:" label-for="project">
        <form-input
          id="project"
          v-model="registration.project"
          placeholder="7 digit number"
          required
          type="number"
          min="1000000"
          max="9999999"
          :state="projectState"
          :no-wheel="true"
        ></form-input>
      </form-group> -->

      <button type="submit" variant="primary">Submit</button>
      <button type="reset" variant="danger">Reset</button>
    </form>
    <!-- <card class="mt-3" header="Form Data Result"> -->
    <pre class="m-0">{{ registration }}</pre>
    <!-- </card> -->
  </div>
</template>

<script>
//import TablesDataService from "@/services/TablesDataService";
import formServices from "@/services/settings.services";

export default {
  name: "FinancialRegistrationForm",
  props: {
    //show: Boolean,
  },
  //   computed: {
  //     registration: {
  //       get() {
  //         return this.$store.getters.getRegistration;
  //       },
  //       set(value) {
  //         this.$store.dispatch("setRegistration", { registration: value });
  //       },
  //     },
  //     clientMinistryState() {
  //       if (this.registration.clientministry !== null) {
  //         return this.registration.clientministry.length === 3 ? true : false;
  //       }
  //       return null;
  //     },
  //     respCodeState() {
  //       if (this.registration.respcode !== null) {
  //         return this.registration.respcode.length === 5 ? true : false;
  //       }
  //       return null;
  //     },
  //     servicelineState() {
  //       if (this.registration.serviceline !== null) {
  //         return this.registration.serviceline.length === 5 ? true : false;
  //       }
  //       return null;
  //     },
  //     stobState() {
  //       if (this.registration.stob !== null) {
  //         return this.registration.stob.length === 4 ? true : false;
  //       }
  //       return null;
  //     },
  //     projectState() {
  //       if (this.registration.project !== null) {
  //         return this.registration.project.length === 7 ? true : false;
  //       }
  //       return null;
  //     },
  //   },
  data() {
    return {
      registration: {
        organization: "",
        branch: "",
        primarycontact: "",
        primaryemail: "",
        financialcontact: "",
        clientministry: null,
        respcode: null,
        serviceline: null,
        stob: null,
        project: null,
      },
      //organizations: formServices.get("organization") || [],
      organizations: [
        {
          value: null,
          text: "Please select an eligible Ministry or organization",
          disabled: true,
        },
        { value: "org-1", text: "Advanced Education and Skills Training" },
        { value: "org-2", text: "Agriculture, Food and Fisheries" },
        { value: "org-3", text: "Attorney General & Housing" },
        { value: "org-4", text: "Children and Family Development" },
        { value: "org-5", text: "Citizens’ Services" },
        { value: "org-6", text: "Education" },
        { value: "org-7", text: "Emergency Management BC" },
        { value: "org-8", text: "Energy, Mines and Low Carbon Innovation" },
        { value: "org-9", text: "Environment and Climate Change Strategy" },
        { value: "org-10", text: "Environment Assessment Office" },
        { value: "org-11", text: "Finance" },
        {
          value: "org-12",
          text: "Forests, Lands, Natural Resource Operations and Rural Development",
        },
        { value: "org-13", text: "Health" },
        { value: "org-14", text: "Indigenous Relations and Reconciliation" },
        { value: "org-15", text: "Jobs, Economic Recovery and Innovation" },
        { value: "org-16", text: "Labour" },
        { value: "org-17", text: "Mental Health & Addictions" },
        { value: "org-18", text: "Municipal Affairs" },
        { value: "org-19", text: "Public Safety & Solicitor General" },
        { value: "org-20", text: "Social Development & Poverty Reduction" },
        { value: "org-21", text: "Tourism, Arts, Culture and Sport" },
        { value: "org-22", text: "Transportation & Infrastructure" },
        { value: "org-23", text: "BC Public Service Agency" },
        {
          value: "org-24",
          text: "Government Communications and Public Engagement",
        },
        { value: "org-25", text: "Office of the Premier" },
      ],
      show: true,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      alert(JSON.stringify(this.registration));
      console.log("test of reg", this.registration);
      console.log(this.$store.getters.isRegistered);

      //   registrationStore
      //     .addRegistration(this.registration)
      //     //   TablesDataService.createRegistration(this.registration)
      //     .then((res) => {
      //       console.log(res);
      //       this.$forceUpdate;
      //       //Perform Success Action
      //     })
      //     .catch((error) => {
      //       console.log(error.response.status);
      //       // error.response.status Check status code
      //     })
      //     .finally(() => {
      //       //Perform action in always
      //     });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.registration.organization = "";
      this.registration.branch = "";
      this.registration.primarycontact = "";
      this.registration.financialcontact = "";
      this.registration.clientministry = null;
      this.registration.respcode = null;
      this.registration.serviceline = null;
      this.registration.stob = null;
      this.registration.project = null;
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

.flex-grid {
  display: flex;
}
.col {
  flex: 1;
}
</style>
