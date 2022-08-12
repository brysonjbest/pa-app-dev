<script>
import GuestList from "../components/GuestList.vue";
import RegistrationList from "../components/RegistrationList.vue";
import InputGuest from "../components/inputs/InputGuest.vue";
import PageHeader from "../components/common/PageHeader.vue";
import { useAuthUserStore } from "../stores/users";
import { useMessageStore } from "../stores/messages";
import { storeToRefs } from "pinia";
import { useFinancialStore } from "../stores/financial";
import { ref } from "vue";

export default {
  props: {
    id: String,
  },
  setup(props) {
    const messageStore = useMessageStore();
    const { message } = storeToRefs(useMessageStore());
    const activeMessage = ref(false);
    const loading = ref(false);
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
      let message = submitStatus ? "submitted" : "re-opened";
      loading.value = true;
      try {
        activeMessage.value = true;

        financialStore
          .registerFinancialInformation({
            submitted: submitStatus,
            registration: props.id,
          })
          .then(() => {
            loading.value = false;
            messageStore.setMessage({
              text: `Successfully ${message} registration!`,
              type: "success",
            });
          })
          .then(() => financialStore.fill(props.id));
      } catch (error) {
        loading.value = false;
        console.warn(error);
        activeMessage.value = true;
        messageStore.setMessage({
          text: `Registration could not be ${message}.`,
          type: "error",
        });
      }
    };

    const addGuestDialog = ref(false);
    const tableInfoDialog = ref(false);
    const guestInfoDialog = ref(false);
    const submissionDialog = ref(false);

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

    const submitRegistration = () => {
      activeMessage.value = false;
      submissionDialog.value = true;
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
      submissionDialog,
      addGuest,
      tableInfo,
      guestInfo,
      submitRegistration,
      dateSubmitted,
      activeMessage,
      message,
      loading,
    };
  },
  components: { GuestList, RegistrationList, InputGuest, PageHeader },
};
</script>

<template>
  <main class="individual-table-view">
    <PageHeader class="pageheader" :footer="`Registration # ${id} `"
      ><span v-if="isSubmitted()">Submitted {{ dateSubmitted() }} by</span>
      <span v-else>In-progress registration for</span>
      {{ getRegistrar() }}</PageHeader
    >

    <ProgressSpinner v-if="loading" />
    <div v-else class="page-body">
      <RegistrationList
        id="personal-registration-table"
        :registrationID="id"
        :detailsView="false"
      />

      <div class="registration-buttons">
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
          label="Add Guests"
          icon="pi pi-pencil"
          class="p-button-rounded p-button-success mr-2"
          @click="addGuest()"
        />
      </div>

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
      <GuestList
        id="personal-registration-guests-table"
        :adminView="false"
        :registrationID="id"
      />
    </div>
  </main>
</template>

<style lang="scss">
.individual-table-view {
  #registration-info {
    .p-card-content {
      font-size: 1rem;
    }
  }

  #personal-registration-table {
    .p-datatable {
      padding: 1rem;
    }
  }

  #personal-registration-guests-table {
    .p-datatable {
      padding: 1rem;
    }
  }
  .registration-buttons {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    gap: 1rem;
  }
  .submission-buttons {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
  }
}
</style>
