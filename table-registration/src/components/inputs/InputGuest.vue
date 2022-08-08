<!-- input one by one, a separate component will show the list updating dynamically -->
<!-- Provides initial registration of financial details -->
<template>
  <div>
    <Spinner v-if="loading" />
    <Message
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}</Message
    >
    <form v-else @submit="onSubmit" @reset="onReset">
      <div class="dropdown">
        <label for="organization">Organization:</label>
        <Dropdown
          v-bind:class="{ 'p-invalid': v$.organization.$error }"
          id="organization"
          v-model="guest.organization"
          :options="organizations"
          optionLabel="text"
          optionValue="value"
          placeholder="Select a Organization"
        />
        <small
          v-if="v$.organization.$error"
          class="p-error"
          id="organization-help"
          >Please select your organization.</small
        >
      </div>

      <div class="text-field">
        <label for="firstname">First Name:</label>
        <InputText
          v-bind:class="{ 'p-invalid': v$.firstname.$error }"
          id="firstname"
          type="firstname"
          aria-describedby="firstname-help"
          v-model="guest.firstname"
          placeholder="First Name"
        />
        <small v-if="v$.firstname.$error" class="p-error" id="firstname-help"
          >Please enter guest's first name.</small
        >
      </div>

      <div class="text-field">
        <label for="lastname">Last Name:</label>
        <InputText
          v-bind:class="{ 'p-invalid': v$.lastname.$error }"
          id="lastname"
          type="lastname"
          aria-describedby="lastname-help"
          v-model="guest.lastname"
          placeholder="Last Name"
        />
        <small v-if="v$.lastname.$error" class="p-error" id="lastname-help"
          >Please enter guest's last name.</small
        >
      </div>

      <div class="dropdown">
        <label for="attendancetype">Attendance Type:</label>
        <Dropdown
          v-bind:class="{ 'p-invalid': v$.attendancetype.$error }"
          id="attendancetype"
          v-model="guest.attendancetype"
          :options="attendancetypes"
          optionLabel="text"
          optionValue="value"
          placeholder="Select the type of attendance for this guest"
        />
        <small
          v-if="v$.attendancetype.$error"
          class="p-error"
          id="attendancetype-help"
          >Please select the attendance type for this guest.</small
        >
      </div>

      <div class="checkbox-group">
        <label for="accessibility">Accessibility Requirements:</label>
        <div
          v-for="each of accessibility"
          :key="each.key"
          class="field-checkbox"
        >
          <Checkbox
            :id="each.key"
            name="each"
            :value="each.value"
            v-model="guest.accessibility"
          />
          <label :for="each.key">{{ each.text }}</label>
        </div>
      </div>

      <div class="checkbox-group">
        <label for="dietary">Dietary Requirements:</label>
        <div v-for="each of dietary" :key="each.key" class="field-checkbox">
          <Checkbox
            :id="each.key"
            name="each"
            :value="each.value"
            v-model="guest.dietary"
          />
          <label :for="each.key">{{ each.text }}</label>
        </div>
      </div>

      <Button type="submit" label="primary" class="p-button-raised"
        >Add Guest</Button
      >
      <Button
        type="reset"
        label="danger"
        class="p-button-raised p-button-danger"
        >Reset</Button
      >
    </form>
  </div>
</template>

<script>
//import TablesDataService from "@/services/TablesDataService";
import formServices from "@/services/settings.services";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useGuestsStore } from "../../stores/guests";
import { useFinancialStore } from "../../stores/financial";

export default {
  props: {
    registrationID: String,
  },
  setup(props) {
    const guestData = useGuestsStore();
    const registrationData = useFinancialStore();
    const { guest } = storeToRefs(useGuestsStore());
    const rules = {
      organization: { required },
      firstname: { required },
      lastname: { required },
      attendancetype: { required },
    };

    const v$ = useVuelidate(rules, guest);
    const organizations = ref(formServices.get("organizations") || []);
    const attendancetypes = ref(formServices.get("attendancetypes") || []);
    const accessibility = ref(formServices.get("accessibilityoptions") || []);
    const dietary = ref(formServices.get("dietaryoptions") || []);

    if (props.registrationID) {
      registrationData.fill(props.registrationID);
    }

    let loading = ref(false);
    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });

    const onSubmit = async function (event) {
      event.preventDefault();
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;
      this.guest.registration = registrationData.getId;
      try {
        loading.value = true;
        guestData
          .registerGuest(this.guest)
          .then((guest) => guestData.addGuestList(guest))
          .then(() => {
            delete this.guest["guid"];
            this.guest.organization = "";
            this.guest.firstname = "";
            this.guest.lastname = "";
            this.guest.attendancetype = "";
            this.guest.dietary = [];
            this.guest.accessibility = [];
            this.$forceUpdate;
            this.v$.$reset();
            loading.value = false;
            message.value = true;
            messageText.value = { severity: "success", text: "Guest Updated!" };
          });
      } catch (error) {
        console.log(error);
        loading.value = false;
        console.warn(err);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Guest could not be updated.",
        };
      } finally {
        setTimeout(() => (message.value = false), 1500);
      }
    };

    //reset to default
    const onReset = function (event) {
      event.preventDefault();
      delete this.guest["guid"];
      this.guest.organization = "";
      this.guest.firstname = "";
      this.guest.lastname = "";
      this.guest.attendancetype = "";
      this.guest.dietary = [];
      this.guest.accessibility = [];
    };
    return {
      loading,
      message,
      messageText,
      guest,
      guestData,
      v$,
      organizations,
      dietary,
      accessibility,
      attendancetypes,
      rules,
      onSubmit,
      onReset,
    };
  },
};
</script>
<style scoped>
/* .checkbox-group {
  display: flex;
} */

.field-checkbox {
  padding: 0px 0.5em;
}
</style>
