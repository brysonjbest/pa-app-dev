<template>
  <div>
    <div>
      <DataTable
        :value="registrations"
        responsiveLayout="stack"
        :key="dataTableRender"
      >
        <Column
          v-for="col of columns"
          :field="col.field"
          :header="col.text"
          :key="col.field"
        ></Column>
        <Column v-if="!detailsView" :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="editRegistration(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-warning"
              @click="confirmDeleteRegistration(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <div>
      <Dialog
        v-model:visible="registrationDialog"
        :style="{ width: '450px' }"
        header="Registration Details"
        :modal="true"
        class="p-fluid"
      >
        <div class="field-dropdown">
          <label for="organization">Organization:</label>
          <Dropdown
            id="organization"
            v-model="registration.organization"
            :options="organizations"
            optionLabel="text"
            optionValue="value"
            placeholder="Select an Organization"
          />
          <div v-if="v$.organization.$error">
            Organization field is required.
          </div>
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
          <small id="primaryemail-help"
            >Enter the Primary Contact's email.</small
          >
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
            >Enter the name of the Financial Contact for this
            registration.</small
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

        <template #footer>
          <Button
            v-if="!detailsView"
            label="Edit Guests"
            icon="pi pi-pencil"
            class="p-button-text"
            @click="editRegistrationGuests"
          />
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="hideDialog"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveRegistration"
          />
        </template>
      </Dialog>
      <Dialog
        v-model:visible="deleteRegistrationDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="registration"
            >Are you sure you want to delete registration #
            <b>{{ registration.guid }}</b> for contact
            {{ registration.primarycontact }}? This will delete all associated
            guests.</span
          >
        </div>
        <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteRegistrationDialog = false"
          />
          <Button
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteRegistration"
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script>
import formServices from "../services/settings.services";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import router from "../router/index.js";

export default {
  props: {
    adminView: Boolean,
    detailsView: Boolean,
    registrationID: String,
  },
  setup(props) {
    const financialStore = useFinancialStore();
    const columns = ref(formServices.get("registrationSelection") || []);
    const organizations = ref(formServices.get("organizations") || []);
    const dataTableRender = ref(0);
    const userStore = useAuthUserStore();
    const detailsView = props.detailsView;

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

    const fillList = function () {
      financialStore.$reset;
      const user = userStore.getUser;
      if (props.adminView) return financialStore.fillAllRegistrations();
      if (props.registrationID)
        return financialStore.fill(props.registrationID);
      else
        return financialStore.fill(user.guid)
          ? financialStore.fill(user.guid)
          : [];
    };

    const loadLazyData = () => {
      fillList();
    };

    onMounted(() => {
      loadLazyData();
    });
    const { registrations } = storeToRefs(useFinancialStore());

    const registration = ref({});
    const v$ = useVuelidate(rules, registration);
    const submitted = ref(false);
    const registrationDialog = ref(false);
    const deleteRegistrationDialog = ref(false);

    //Dialog controls
    const editRegistration = (prod) => {
      registration.value = { ...prod };
      registrationDialog.value = true;
    };
    const confirmDeleteRegistration = (prod) => {
      registration.value = prod;
      deleteRegistrationDialog.value = true;
    };

    const hideDialog = () => {
      registrationDialog.value = false;
      submitted.value = false;
    };

    const editRegistrationGuests = async function (event) {
      event.preventDefault();
      console.log(registration.value.guid, "this is current reg details");
      router.push(`/admin/edit/${registration.value.guid}`);
    };

    const saveRegistration = async function (event) {
      event.preventDefault();
      submitted.value = true;

      financialStore
        .registerFinancialInformation(
          registration.value,
          registration.value["_id"]
        )

        .then(() => {
          registrationDialog.value = false;
          registration.value = {};
        })
        .then(fillList())
        .catch((error) => {
          console.log(error);
          // error.response.status Check status code
        })
        .finally(() => {
          loadLazyData();
        });
    };

    const deleteRegistration = async function () {
      financialStore
        .deleteRegistration(registration.value["_id"])

        .then(() => {})
        .then(fillList())
        .catch((error) => {
          console.log(error);
          // error.response.status Check status code
        })
        .finally(() => {
          deleteRegistrationDialog.value = false;
          registration.value = {};
          loadLazyData();
          //Perform action in always
        });
    };

    return {
      columns,
      organizations,
      registrations,
      registration,
      submitted,
      detailsView,
      v$,
      registrationDialog,
      deleteRegistrationDialog,
      dataTableRender,
      editRegistration,
      confirmDeleteRegistration,
      deleteRegistration,
      hideDialog,
      editRegistrationGuests,
      saveRegistration,
      loadLazyData,
    };
  },
};
</script>
