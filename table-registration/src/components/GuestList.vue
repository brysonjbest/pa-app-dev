<template>
  <div>
    <div>
      <DataTable
        :value="guests"
        responsiveLayout="stack"
        :paginator="adminView"
        :rows="10"
        ref="dt"
        stripedRows
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="[
          'firstname',
          'lastname',
          'attendancetype',
          'accessibility',
          'dietary',
          'registration',
        ]"
        :loading="loading"
        showGridlines
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      >
        <template #header>
          <div style="text-align: left">
            <Button
              icon="pi pi-external-link"
              label="Export"
              @click="exportCSV($event)"
            />
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              class="p-button-outlined"
              @click="clearFilters()"
            />
            <span v-if="adminView" class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
            <Button
              v-if="!adminView"
              type="button"
              label="Total Guests"
              icon="pi pi-users"
              class="p-button-warning"
              :badge="guestCount()"
              badgeClass="p-badge-danger"
            />
          </div>
        </template>
        <template #empty> No guests found. </template>
        <template #loading> Loading guest data. Please wait. </template>
        <Column
          v-if="adminView"
          field="registration"
          header="Registration"
          key="registration"
          :sortable="true"
        >
          <template #body="{ data }">
            <router-link
              :to="`/admin/edit/${data.registration}`"
              class="registration-link"
              >{{ data.registration }}</router-link
            > </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by registration"
            /> </template
        ></Column>
        <Column
          field="organization"
          header="Organization"
          key="organization"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ lookup("organizations", data.organization) }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by organization"
            /> </template
        ></Column>
        <Column
          field="firstname"
          header="First Name"
          key="firstname"
          :sortable="true"
        >
          <template #body="{ data }"> {{ data.firstname }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by First Name"
            /> </template
        ></Column>
        <Column
          field="lastname"
          header="Last Name"
          key="lastname"
          :sortable="true"
        >
          <template #body="{ data }"> {{ data.lastname }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Last Name"
            /> </template
        ></Column>
        <Column
          field="attendancetype"
          header="Attendance Type"
          key="attendancetype"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ lookup("attendancetypes", data.attendancetype) }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Attendance Type"
            /> </template
        ></Column>
        <Column
          field="accessibility"
          header="Accessibility Requirements"
          key="accessibility"
          :sortable="true"
        >
          <template #body="{ data }">
            {{
              lookupLoop("accessibilityoptions", data.accessibility)
            }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Accessibility Options"
            /> </template
        ></Column>
        <Column
          field="dietary"
          header="Dietary Requirements"
          key="dietary"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ lookupLoop("dietaryoptions", data.dietary) }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Dietary Requirements"
            /> </template
        ></Column>
        <Column
          v-if="adminView"
          field="createdAt"
          header="Created:"
          key="createdAt"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ formatDate(data.createdAt) }},<br />{{
              formatTime(data.createdAt)
            }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Date Created"
            /> </template
        ></Column>
        <Column
          v-if="adminView"
          field="updatedAt"
          header="Updated:"
          key="updatedAt"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ formatDate(data.updatedAt) }},<br />
            {{ formatTime(data.updatedAt) }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Date Updated"
            /> </template
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
import { FilterMatchMode, FilterOperator } from "primevue/api";

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
    const userStore = useAuthUserStore();
    const dt = ref();
    const { adminView, registrationID } = props;
    const guestCount = function () {
      return String(guestStore.getGuestsCount);
    };

    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },

      organization: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      firstname: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      lastname: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      attendancetype: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      accessibility: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      dietary: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      createdAt: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      updatedAt: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });

    const clearFilters = () => {
      initFilters();
    };
    const initFilters = () => {
      filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

        organization: {
          operator: FilterOperator.OR,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        firstname: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        lastname: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        attendancetype: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        accessibility: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        dietary: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        createdAt: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        updatedAt: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
      };
    };

    const loading = ref(true);

    const exportCSV = () => {
      dt.value.exportCSV();
    };

    const fillList = function () {
      const user = userStore.getUser;
      guestStore.$reset;
      loading.value = false;
      if (adminView) return guestStore.fillGuests();
      if (registrationID)
        return guestStore.fillGuestsRegistration(registrationID);
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

    const lookup = function (key, value) {
      return formServices.lookup(key, value);
    };

    const formatDate = (value) => {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const formatTime = (value) => {
      const date = new Date(value);

      return date.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const lookupLoop = function (key, data) {
      let list = "";
      for (let each of data) {
        if (list.length > 0) {
          list += `, ${lookup(key, each)}`;
        } else {
          list = lookup(key, each);
        }
      }
      return list;
    };

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
      guestCount,
      columns,
      dt,
      filters,
      loading,
      exportCSV,
      clearFilters,
      organizations,
      attendancetypes,
      accessibility,
      dietary,
      guests,
      guest,
      adminView,
      submitted,
      guestDialog,
      deleteGuestDialog,
      formatDate,
      formatTime,
      lookup,
      lookupLoop,
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
