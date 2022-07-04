<!-- Provides initial registration of financial details -->
<template>
  <div>
    <form @submit="onSubmit" @reset="onReset">
      <Dropdown
        id="organization"
        v-model="registration.organization"
        :options="organizations"
        optionLabel="text"
        optionValue="value"
        placeholder="Select a Organization"
      />
      <h5>Branch</h5>
      <div class="field">
        <label for="branch">Branch</label>
        <InputText
          id="branch"
          type="branch"
          aria-describedby="branch-help"
          v-model="registration.branch"
        />
        <small id="branch-help">Enter your branch.</small>
      </div>

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

<script setup>
//import TablesDataService from "@/services/TablesDataService";
import formServices from "@/services/settings.services";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useFinancialStore } from "../../stores/financial";

const { registration } = storeToRefs(useFinancialStore());
// const registration = ref({
//   organization: "",
//   branch: "",
//   primarycontact: "",
//   primaryemail: "",
//   financialcontact: "",
//   clientministry: null,
//   respcode: null,
//   serviceline: null,
//   stob: null,
//   project: null,
// });
const organizations = ref(formServices.get("organizations") || []);

const onSubmit = function (event) {
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
};
const onReset = function (event) {
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
};
</script>

<style scoped>
.flex-grid {
  display: flex;
}
.col {
  flex: 1;
}
</style>
