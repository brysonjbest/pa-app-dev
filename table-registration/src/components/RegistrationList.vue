<template>
  <div>
    <Spinner v-if="loading" />
    <Message
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}</Message
    >
    <div v-else>
      <DataTable
        class="p-datatable-sm"
        :value="registrations"
        responsiveLayout="stack"
        :key="dataTableRender"
        :paginator="adminView"
        :rows="10"
        ref="dt"
        stripedRows
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="[
          'organization',
          'branch',
          'primarycontact',
          'primaryemail',
          'financialcontact',
          'clientministry',
          'resp',
          'serviceline',
          'project',
          'guid',
        ]"
        :loading="loading"
        showGridlines
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      >
        <template v-if="adminView" #header>
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
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </template>
        <template #empty> No registrations found. </template>
        <template #loading> Loading registration data. Please wait. </template>
        <Column
          v-if="adminView"
          field="guid"
          header="ID#"
          key="guid"
          class="guid"
        >
          <template #body="{ data }">
            <router-link :to="`/admin/edit/${data.guid}`">{{
              data.registrar
            }}</router-link>
          </template></Column
        >
        <Column
          field="organization"
          filterField="organization"
          header="Organization"
          key="organization"
        >
          <template #body="{ data }">
            {{ lookup("organizations", data.organization) }}
          </template>
          <template #filter="{ filterModel }">
            <Dropdown
              v-model="filterModel.value"
              :options="organizations"
              optionLabel="text"
              placeholder="Any"
              class="p-column-filter"
              :showClear="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div>{{ lookup("organizations", slotProps.value) }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="item">
                  <div>{{ lookup("organizations", slotProps.option) }}</div>
                </div>
              </template>
            </Dropdown>
          </template></Column
        >
        <Column
          v-for="col of filter(columns)"
          :field="col.field"
          :header="col.text"
          :key="col.field"
        >
          <template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              :placeholder="`Search by ${col.field}`"
            /> </template
        ></Column>
        <Column
          v-if="adminView"
          field="guestCount"
          dataType="numeric"
          header="Guest Count:"
          key="guestCount"
          :sortable="true"
        >
          <template #body="{ data }">
            <span>{{ data.guestCount }}</span>
          </template>
          <template #filter="{ filterModel }">
            <InputNumber
              v-model="filterModel.value"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              decrementButtonClass="p-button-danger"
              incrementButtonClass="p-button-success"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
          </template>
        </Column>
        <Column
          v-if="adminView"
          field="submitted"
          header="Submitted?"
          key="submitted"
          dataType="boolean"
        >
          <template #body="{ data }">
            <i
              class="pi pi-check-circle"
              :class="{
                'true-icon pi-check-circle': data.submitted,
                'false-icon pi-times-circle': !data.submitted,
              }"
              style="font-size: 2rem"
            ></i>
          </template>
          <template #filter="{ filterModel }">
            <TriStateCheckbox v-model="filterModel.value" /> </template
        ></Column>
        <Column
          v-if="adminView"
          field="createdAt"
          header="Created:"
          key="createdAt"
          :sortable="true"
          dataType="date"
        >
          <template #body="{ data }">
            {{ formatDate(data.createdAt) }},<br />{{
              formatTime(data.createdAt)
            }}
          </template>
          <template #filter="{ filterModel }">
            <Calendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            /> </template
        ></Column>

        <Column
          v-if="adminView"
          field="updatedAt"
          header="Updated:"
          key="updatedAt"
          :sortable="true"
          dataType="date"
        >
          <template #body="{ data }">
            {{ formatDate(data.updatedAt) }},<br />
            {{ formatTime(data.updatedAt) }}
          </template>
          <template #filter="{ filterModel }">
            <Calendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            /> </template
        ></Column>
        <Column v-if="!detailsView" :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button
              v-if="!slotProps.data.submitted"
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="editRegistration(slotProps.data)"
            />
            <Button
              v-if="!slotProps.data.submitted"
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
        @hide="() => loadLazyData()"
        ><InputFinancial
          :registrationID="registration.guid"
          :adminView="adminView"
          :detailsView="detailsView"
      /></Dialog>
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
            {{ registration.primarycontact }}?<br />
            This will delete all associated guests.<br /><b
              >This action cannot be undone.</b
            ></span
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
import InputFinancial from "./inputs/InputFinancial.vue";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import router from "../router";

export default {
  props: {
    adminView: Boolean,
    detailsView: Boolean,
    registrationID: String,
  },
  setup(props) {
    const financialStore = useFinancialStore();
    const { registrations } = storeToRefs(useFinancialStore());
    const columns = ref(formServices.get("registrationSelection") || []);
    const organizations = ref(
      (formServices.get("organizations") || []).map((each) => each.value)
    );
    const dataTableRender = ref(0);
    const userStore = useAuthUserStore();
    const detailsView = props.detailsView || false;
    const adminView = props.adminView || false;
    const registrationID = props.registrationID || null;
    const dt = ref();

    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });

    //Define filters for table sorting and searching
    const filters = ref(formServices.get("registrationFilters") || {});
    const clearFilters = () => {
      initFilters();
    };
    const initFilters = () => {
      filters.value = formServices.get("registrationFilters") || {};
    };

    const loading = ref(false);

    //Fill registration table with appropriate data based on props
    const fillList = async function () {
      const user = userStore.getUser;
      financialStore.$reset;
      loading.value = true;
      try {
        if (props.adminView) return await financialStore.fillAllRegistrations();
        if (props.registrationID)
          return await financialStore.fill(props.registrationID);
        else
          return (await financialStore.fill(user.guid))
            ? financialStore.fill(user.guid)
            : [];
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not fetch registrations.",
        };
      } finally {
        loading.value = false;
        setTimeout(() => (message.value = false), 1500);
      }
    };

    const loadLazyData = () => {
      fillList().then(() => {
        registrations.value.forEach((registration) => {
          registration.createdAt = new Date(registration.createdAt);
          registration.updatedAt = new Date(registration.updatedAt);
          registration.guestCount = Number(registration.guests.length);
        });
      });
    };

    onMounted(() => {
      loadLazyData();
    });

    const isSubmitted = function () {
      return financialStore.getRegistration.submitted;
    };

    //Helper Functions

    const lookup = function (key, value) {
      return formServices.lookup(key, value);
    };

    const exportCSV = () => {
      dt.value.exportCSV();
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

    const filter = function (data) {
      return data.filter((item) => item.field !== "organization");
    };

    const tableCount = function (data) {
      let tableCount = 0;
      if (data % 10 <= 5 && data % 10 != 0) tableCount += 0.5;
      if (data % 10 > 5) tableCount += 1;
      if (data / 10 >= 1) tableCount += Math.floor(data / 10);
      return tableCount;
    };

    //Dialog Controls

    const registration = ref({});
    const submitted = ref(false);
    const registrationDialog = ref(false);
    const deleteRegistrationDialog = ref(false);

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

    //Registration Information Controls

    const deleteRegistration = async function () {
      loading.value = true;
      try {
        financialStore
          .deleteRegistration(registration.value["_id"])
          .then(fillList())
          .then(() => {
            loading.value = false;
            message.value = true;
            messageText.value = {
              severity: "success",
              text: "Successfully deleted registration and all connected guests.",
            };
          });
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not delete registration.",
        };
      } finally {
        deleteRegistrationDialog.value = false;

        await new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
          message.value = false;
          if (props.registrationID) router.push("/admin");
          else if (!props.adminView) router.push("/");
          else fillList();
        });
      }
    };

    return {
      columns,
      organizations,
      registrations,
      registration,
      isSubmitted,
      submitted,
      detailsView,
      adminView,
      registrationDialog,
      deleteRegistrationDialog,
      dataTableRender,
      filters,
      loading,
      message,
      messageText,
      dt,
      clearFilters,
      exportCSV,
      formatDate,
      formatTime,
      lookup,
      filter,
      editRegistration,
      confirmDeleteRegistration,
      deleteRegistration,
      hideDialog,
      loadLazyData,
      tableCount,
    };
  },
  components: { InputFinancial },
};
</script>
