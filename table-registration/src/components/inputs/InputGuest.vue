<!-- input one by one, a separate component will show the list updating dynamically -->
<!-- Provides initial registration of financial details -->
<template>
  <div>
    <form @submit="onSubmit" @reset="onReset">
      <div class="dropdown">
        <label for="organization">Organization:</label>
        <Dropdown
          id="organization"
          v-model="guest.organization"
          :options="organizations"
          optionLabel="text"
          optionValue="value"
          placeholder="Select a Organization"
        />
        <div v-if="v$.organization.$error">Organization field is required.</div>
      </div>

      <div class="text-field">
        <label for="firstname">First Name:</label>
        <InputText
          id="firstname"
          type="firstname"
          aria-describedby="firstname-help"
          v-model="guest.firstname"
          placeholder="First Name"
        />
        <div v-if="v$.firstname.$error">First name of guest is required.</div>
        <small id="firstname-help">Enter guest's first name.</small>
      </div>

      <div class="text-field">
        <label for="lastname">Last Name:</label>
        <InputText
          id="lastname"
          type="lastname"
          aria-describedby="lastname-help"
          v-model="guest.lastname"
          placeholder="Last Name"
        />
        <div v-if="v$.lastname.$error">Last name of guest is required.</div>
        <small id="lastname-help">Enter guest's last name.</small>
      </div>

      <div class="dropdown">
        <label for="attendancetype">Attendance Type:</label>
        <Dropdown
          id="attendancetype"
          v-model="guest.attendancetype"
          :options="attendancetypes"
          optionLabel="text"
          optionValue="value"
          placeholder="Select the type of attendance for this guest"
        />
        <div v-if="v$.attendancetype.$error">Attendance type is required.</div>
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
    <!-- <card class="mt-3" header="Form Data Result"> -->
    <pre class="m-0">{{ guest }}</pre>
    <!-- </card> -->
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

export default {
  setup() {
    const guestData = useGuestsStore();
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

    const onSubmit = async function (event) {
      event.preventDefault();
      const isFormCorrect = await this.v$.$validate();
      console.log(isFormCorrect);

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
          guestData.fillGuests();
        })
        .catch((error) => {
          console.log(error);
          // error.response.status Check status code
        })
        .finally(() => {
          //Perform action in always
        });
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
<style scoped></style>
