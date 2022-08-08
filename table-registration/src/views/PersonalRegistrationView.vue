<script>
import GuestList from "../components/GuestList.vue";
import RegistrationList from "../components/RegistrationList.vue";
import InputGuest from "../components/inputs/InputGuest.vue";
import PageHeader from "../components/common/PageHeader.vue";
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { ref } from "vue";

export default {
  props: {
    id: String,
  },
  setup(props) {
    const userStore = useAuthUserStore();
    userStore.login();
    const financialStore = useFinancialStore();

    financialStore.fill(props.id);

    const tableCount = () => {
      return String(financialStore.getTableCount);
    };

    const guestCount = () => {
      return String(financialStore.getGuestCount);
    };

    const getRegistrar = () => {
      return financialStore.getRegistrar;
    };

    const isSubmitted = () => {
      return financialStore.getRegistration.submitted;
    };

    const dateSubmitted = () => {
      const date = new Date(financialStore.getRegistration.updatedAt);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const isAdmin = () => {
      return userStore.isAdmin;
    };

    const toggleRegistration = async () => {
      let submitStatus = isSubmitted() ? false : true;
      financialStore
        .registerFinancialInformation({
          submitted: submitStatus,
          registration: props.id,
        })
        .then(() => financialStore.fill(props.id));
    };

    const addGuestDialog = ref(false);
    const tableInfoDialog = ref(false);
    const guestInfoDialog = ref(false);

    //PrimeDialog controls
    const addGuest = () => {
      addGuestDialog.value = true;
    };

    const tableInfo = () => {
      tableInfoDialog.value = true;
    };

    const guestInfo = () => {
      guestInfoDialog.value = true;
    };

    return {
      userStore,
      financialStore,
      tableCount,
      guestCount,
      getRegistrar,
      isSubmitted,
      isAdmin,
      toggleRegistration,
      addGuestDialog,
      tableInfoDialog,
      guestInfoDialog,
      addGuest,
      tableInfo,
      guestInfo,
      dateSubmitted,
    };
  },
  components: { GuestList, RegistrationList, InputGuest, PageHeader },
};
</script>

<template>
  <main>
    <PageHeader :title="`Registration # ${id} `"
      ><span v-if="isSubmitted()">Submitted {{ dateSubmitted() }} by</span>
      <span v-else>In Progress Registration for</span>
      {{ getRegistrar() }}</PageHeader
    >

    <RegistrationList :registrationID="id" :detailsView="false" />
    <PrimeButton
      v-if="!isSubmitted()"
      label="Add Guests"
      icon="pi pi-pencil"
      class="p-button-rounded p-button-success mr-2"
      @click="addGuest()"
    />
    <PrimeButton
      type="button"
      label="Total Guests"
      icon="pi pi-users"
      class="p-button-warning"
      :badge="guestCount()"
      @click="guestInfo()"
      badgeClass="p-badge-danger"
    />
    <PrimeButton
      type="button"
      label="Tables"
      icon="pi pi-ticket"
      class="p-button-warning"
      :badge="tableCount()"
      @click="tableInfo()"
      badgeClass="p-badge-danger"
    />
    <PrimeButton
      v-if="!isSubmitted() && (guestCount() >= 5 || isAdmin())"
      type="button"
      label="Submit Registration"
      icon="pi pi-ticket"
      class="p-button-warning"
      @click="toggleRegistration()"
      badgeClass="p-badge-danger"
    />
    <PrimeButton
      v-if="isSubmitted() && isAdmin()"
      type="button"
      label="Unsubmit Registration"
      icon="pi pi-ticket"
      class="p-button-warning"
      @click="toggleRegistration()"
      badgeClass="p-badge-danger"
    />
    <PrimeDialog
      v-model:visible="tableInfoDialog"
      header="Table Information"
      :modal="true"
      class="p-fluid"
      >Warning regarding table charges. Please be aware that half tables may not
      be able to be accomodated, and you may be charged the full table amount.
      Current table count: {{ tableCount() }}
    </PrimeDialog>

    <PrimeDialog
      v-model:visible="guestInfoDialog"
      header="Guest Information"
      :modal="true"
      class="p-fluid"
      >Total Number of Guests: {{ guestCount() }}.
    </PrimeDialog>

    <PrimeDialog
      v-model:visible="addGuestDialog"
      header="Add a new Guest"
      :modal="true"
      class="p-fluid"
      ><InputGuest :registrationID="id"
    /></PrimeDialog>
    <GuestList :adminView="false" :registrationID="id" />
  </main>
</template>
