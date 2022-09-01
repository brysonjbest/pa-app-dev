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
    const { registration } = storeToRefs(useFinancialStore());
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

    const isCompleted = () => {
      return financialStore.getCompleted;
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
      registration,
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
      isCompleted,
    };
  },
  components: { GuestList, RegistrationList, InputGuest, PageHeader },
};
</script>

<template>
  <main class="personal-registration">
    <PageHeader
      class="pageheader"
      :footer="`Registration # ${registration._id} `"
      ><span v-if="isSubmitted()">Submitted {{ dateSubmitted() }} by</span>
      <span v-else>In-progress registration for</span>
      {{ getRegistrar() }}</PageHeader
    >
    <div v-if="!isAdmin() & !isSubmitted()">
      <div>
        <PrimeCard id="registration-info">
          <template #content>
            Please ensure that the registration information on this page is
            complete prior to submitting your registration for the event. If you
            cannot complete the registration at this time, your current progress
            will remain saved here until you are ready to complete your
            submission.
          </template></PrimeCard
        >
      </div>
    </div>
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
          label="Tables"
          icon="pi pi-ticket"
          class="p-button-warning"
          :badge="tableCount()"
          @click="tableInfo()"
          badgeClass="p-badge-danger"
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
          v-if="!isSubmitted()"
          label="Add Guests"
          icon="pi pi-pencil"
          class="p-button-rounded p-button-success mr-2"
          @click="addGuest()"
        />
      </div>
      <PrimeDialog
        v-model:visible="tableInfoDialog"
        header="Table Information"
        :modal="true"
        class="p-fluid"
        >Warning regarding table charges:<br />
        Please be aware that half tables may not be able to be accomodated, and
        you may be charged the full table amount. <br />
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
        v-model:visible="submissionDialog"
        header="Confirm Submission"
        :modal="true"
        class="p-fluid"
      >
        <div v-if="!isCompleted() && !isAdmin()">
          <p>
            There are currently missing fields on your registration.
            <br />
            Please update the registration details and ensure that all fields
            are completed.
          </p>
        </div>
        <div v-else-if="!isSubmitted() && !activeMessage">
          <p>
            Are you sure you wish to submit your event-registration?<br />
            You will not be able to revise your submission once completed.
          </p>
          <p>
            Please be aware that half tables may not be able to be accomodated,
            and you may be charged the full table amount.<br />
            Guests submitted on this registration: {{ guestCount() }}.<br />
            Total tables required for this number of guests: {{ tableCount() }}
          </p>
        </div>
        <div v-else-if="isSubmitted() && isAdmin() && !activeMessage">
          <p>
            Are you sure you wish to reverse submission of this
            event-registration?<br />
            This will re-open this submission for editing, and remove the
            current submission date.
          </p>
        </div>
        <PrimeButton
          v-if="
            !isSubmitted() && !activeMessage && (isCompleted() || isAdmin())
          "
          type="button"
          label="Confirm submit registration"
          icon="pi pi-ticket"
          class="p-button-warning"
          @click="toggleRegistration()"
          badgeClass="p-badge-danger"
        />
        <PrimeButton
          v-if="isSubmitted() && isAdmin() && !activeMessage"
          type="button"
          label="Re-open registration"
          icon="pi pi-ticket"
          class="p-button-warning"
          @click="toggleRegistration()"
          badgeClass="p-badge-danger"
        />
        <PrimeMessage
          show
          v-if="activeMessage"
          :variant="message.type"
          :closable="false"
        >
          <p>
            {{ message.text }}
          </p>
        </PrimeMessage>
      </PrimeDialog>

      <PrimeDialog
        v-model:visible="addGuestDialog"
        :style="{ width: '50rem', margin: '5rem' }"
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
      <div class="submission-buttons">
        <PrimeButton
          v-if="!isSubmitted() && (guestCount() >= 5 || isAdmin())"
          type="button"
          label="Submit Registration"
          icon="pi pi-ticket"
          class="p-button-warning"
          @click="submitRegistration()"
          badgeClass="p-badge-danger"
        />
        <PrimeButton
          v-if="isSubmitted() && isAdmin()"
          type="button"
          label="Unsubmit Registration"
          icon="pi pi-ticket"
          class="p-button-warning"
          @click="submitRegistration()"
          badgeClass="p-badge-danger"
        />
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.personal-registration {
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
