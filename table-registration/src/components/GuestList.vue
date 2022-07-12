<template>
  <div>
    <div>
      <DataTable
        :value="guests"
        responsiveLayout="stack"
        :key="dataTableRender"
      >
        <Column
          v-for="col of columns"
          :field="col.field"
          :header="col.text"
          :key="col.field"
        ></Column>
        <Column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="editGuest(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-warning"
              @click="confirmDeleteGuest(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <div>
      <Dialog
        v-model:visible="guestDialog"
        :style="{ width: '450px' }"
        header="Guest Details"
        :modal="true"
        class="p-fluid"
      >
        <div class="field-text">
          <label for="firstname">First Name</label>
          <InputText
            id="firstname"
            v-model.trim="guest.firstname"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !guest.firstname }"
          />
          <small class="p-error" v-if="submitted && !guest.firstname"
            >First Name is required.</small
          >
        </div>
        <div class="field-text">
          <label for="lastname">Last Name</label>
          <InputText
            id="lastname"
            v-model.trim="guest.lastname"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !guest.lastname }"
          />
          <small class="p-error" v-if="submitted && !guest.lastname"
            >Last Name is required.</small
          >
        </div>

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
          <small class="p-error" v-if="submitted && !guest.organization"
            >Organization is required.</small
          >
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

        <template #footer>
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
            @click="saveGuest"
          />
        </template>
      </Dialog>
      <Dialog
        v-model:visible="deleteGuestDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="guest"
            >Are you sure you want to delete
            <b>{{ guest.firstname }} {{ guest.lastname }}</b
            >?</span
          >
        </div>
        <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteGuestDialog = false"
          />
          <Button
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteGuest"
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
import { useGuestsStore } from "../stores/guests";
import { useAuthUserStore } from "../stores/users";

export default {
  props: {
    adminView: Boolean,
    registrationID: String,
  },
  setup(props) {
    const guestStore = useGuestsStore();
    const columns = ref(formServices.get("guestSelection") || []);
    const organizations = ref(formServices.get("organizations") || []);
    const attendancetypes = ref(formServices.get("attendancetypes") || []);
    const accessibility = ref(formServices.get("accessibilityoptions") || []);
    const dietary = ref(formServices.get("dietaryoptions") || []);
    const dataTableRender = ref(0);
    const userStore = useAuthUserStore();

    const fillList = function () {
      const user = userStore.getUser;
      guestStore.$reset;
      if (props.adminView) return guestStore.fillGuests();
      if (props.registrationID)
        return guestStore.fillGuestsRegistration(props.registrationID);
      else
        return guestStore.fillGuestsRegistration(user.guid)
          ? guestStore.fillGuestsRegistration(user.guid)
          : [];
    };

    const loadLazyData = () => {
      fillList();
    };

    onMounted(() => {
      loadLazyData();
    });
    const { guests } = storeToRefs(useGuestsStore());

    const guest = ref({});
    const submitted = ref(false);
    const guestDialog = ref(false);
    const deleteGuestDialog = ref(false);

    //Dialog controls
    const editGuest = (prod) => {
      guest.value = { ...prod };
      guestDialog.value = true;
    };
    const confirmDeleteGuest = (prod) => {
      guest.value = prod;
      deleteGuestDialog.value = true;
    };

    const hideDialog = () => {
      guestDialog.value = false;
      submitted.value = false;
    };

    const saveGuest = async function (event) {
      event.preventDefault();
      submitted.value = true;

      guestStore
        .updateGuest(guest.value["_id"], guest.value)

        .then(() => {
          guestDialog.value = false;
          guest.value = {};
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

    const deleteGuest = async function () {
      guestStore
        .deleteGuest(guest.value["_id"])

        .then(() => {})
        .then(fillList())
        .catch((error) => {
          console.log(error);
          // error.response.status Check status code
        })
        .finally(() => {
          deleteGuestDialog.value = false;
          guest.value = {};
          loadLazyData();
          //Perform action in always
        });
    };

    return {
      columns,
      organizations,
      attendancetypes,
      accessibility,
      dietary,
      guests,
      guest,
      submitted,
      guestDialog,
      deleteGuestDialog,
      dataTableRender,
      editGuest,
      confirmDeleteGuest,
      deleteGuest,
      hideDialog,
      saveGuest,
      loadLazyData,
    };
  },
};
</script>
