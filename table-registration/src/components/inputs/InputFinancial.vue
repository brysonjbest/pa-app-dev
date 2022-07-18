<!-- Provides initial registration of financial details -->
<!-- To put in notifications of error when submitting page -->
<template>
  <div>
    <form @submit="onSubmit" @reset="onReset">
      <div class="dropdown">
        <label for="organization">Organization:</label>
        <Dropdown
          id="organization"
          v-model="registration.organization"
          :options="organizations"
          optionLabel="text"
          optionValue="value"
          placeholder="Select an Organization"
        />
        <div v-if="v$.organization.$error">Organization field is required.</div>
      </div>

      <div class="text-field">
        <label for="branch">Branch:</label>
        <InputText
          id="branch"
          type="branch"
          aria-describedby="branch-help"
          v-model.trim="registration.branch"
        />
        <div v-if="v$.branch.$error">Branch is required.</div>
        <small id="branch-help">Enter your branch.</small>
      </div>

      <div class="text-field">
        <label for="primarycontact">Primary Contact:</label>
        <InputText
          id="primarycontact"
          type="primarycontact"
          aria-describedby="primarycontact-help"
          v-model.trim="registration.primarycontact"
        />
        <small id="primarycontact-help"
          >Enter the name of the Primary Contact for this registration.</small
        >
      </div>
      <div class="text-field">
        <label for="primaryemail">Primary Contact Email:</label>
        <InputText
          id="primaryemail"
          type="primaryemail"
          aria-describedby="primaryemail-help"
          v-model.trim="registration.primaryemail"
        />
        <small id="primaryemail-help">Enter the Primary Contact's email.</small>
      </div>
      <div class="text-field">
        <label for="financialcontact">Financial Contact:</label>
        <InputText
          id="financialcontact"
          type="financialcontact"
          aria-describedby="financialcontact-help"
          v-model.trim="registration.financialcontact"
        />
        <small id="financialcontact-help"
          >Enter the name of the Financial Contact for this registration.</small
        >
      </div>
      <div class="number-field">
        <label for="clientministry">Client/Ministry Number:</label>
        <InputNumber
          id="clientministry"
          v-model="registration.clientministry"
          :min="100"
          :max="999"
          aria-placeholder="3 digit number"
          placeholder="3 digit number"
          :useGrouping="false"
        />
      </div>
      <div class="number-field">
        <label for="respcode">RESP Code:</label>
        <InputNumber
          id="respcode"
          v-model="registration.respcode"
          :min="10000"
          :max="99999"
          aria-placeholder="5 digit number"
          placeholder="5 digit number"
          :useGrouping="false"
        />
      </div>
      <div class="number-field">
        <label for="serviceline">Service Line:</label>
        <InputNumber
          id="serviceline"
          v-model="registration.serviceline"
          :min="10000"
          :max="99999"
          aria-placeholder="5 digit number"
          placeholder="5 digit number"
          :useGrouping="false"
        />
      </div>
      <div class="number-field">
        <label for="stob">STOB:</label>
        <InputNumber
          id="stob"
          v-model="registration.stob"
          :min="1000"
          :max="9999"
          aria-placeholder="4 digit number"
          placeholder="4 digit number"
          :useGrouping="false"
        />
      </div>
      <div class="number-field">
        <label for="project">Project:</label>
        <InputNumber
          id="project"
          v-model="registration.project"
          :min="1000000"
          :max="9999999"
          aria-placeholder="7 digit number"
          placeholder="7 digit number"
          :useGrouping="false"
        />
      </div>

      <Button type="submit" label="primary" class="p-button-raised"
        >Submit</Button
      >
      <Button
        type="reset"
        label="danger"
        class="p-button-raised p-button-danger"
        >Reset</Button
      >
    </form>
    <!-- <card class="mt-3" header="Form Data Result"> -->
    <!-- <pre class="m-0">{{ registration }}</pre> -->
    <!-- </card> -->
  </div>
</template>

<script>
//import TablesDataService from "@/services/TablesDataService";
import { ref } from "vue";
import formServices from "@/services/settings.services";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { storeToRefs } from "pinia";
import { useFinancialStore } from "../../stores/financial";
import { useAuthUserStore } from "../../stores/users";
import router from "../../router/index.js";

export default {
  setup() {
    const register = useFinancialStore();
    const userStore = useAuthUserStore();
    const { registration } = storeToRefs(useFinancialStore());
    const rules = {
      organization: { required },
      branch: { required },
      primarycontact: { required },
      primaryemail: { required, email },
      financialcontact: { required },
      clientministry: { required },
      respcode: { required },
      serviceline: { required },
      stob: { required },
      project: { required },
    };

    const v$ = useVuelidate(rules, registration);
    const organizations = ref(formServices.get("organizations") || []);

    const onSubmit = async function (event) {
      event.preventDefault();
      const isFormCorrect = await this.v$.$validate();
      console.log(isFormCorrect);
      if (!isFormCorrect) return;
      register
        .registerFinancialInformation(this.registration)
        .then((res) => {
          console.log(res);
          this.$forceUpdate;
          //Perform Success Action
        })
        .catch((error) => {
          console.log(error);
          // error.response.status Check status code
        })
        .finally(() => {
          router.push("/create/registration/");
          //Perform action in always
        });
    };

    //reset to default
    const onReset = function (event) {
      event.preventDefault();
      this.registration.organization = "";
      this.registration.branch = "";
      this.registration.primarycontact = "";
      this.registration.primaryemail = "";
      this.registration.financialcontact = "";
      this.registration.clientministry = null;
      this.registration.respcode = null;
      this.registration.serviceline = null;
      this.registration.stob = null;
      this.registration.project = null;
    };

    const userGUID = userStore.getUser;
    this.registration.registrar = userGUID.username;
    register.fill(userGUID.guid);

    return { registration, v$, organizations, onSubmit, onReset };
  },
};
</script>
<style scoped></style>
