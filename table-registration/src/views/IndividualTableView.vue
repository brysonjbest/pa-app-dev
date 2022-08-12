<script>
import GuestList from "../components/GuestList.vue";
import RegistrationList from "../components/RegistrationList.vue";
import TableList from "../components/TableList.vue";
import PageHeader from "../components/common/PageHeader.vue";
import { useAuthUserStore } from "../stores/users";
import { useMessageStore } from "../stores/messages";
import { useTablesStore } from "../stores/tables";
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

    const tableStore = useTablesStore();

    tableStore.fillTable(props.id);

    const guestCount = () => {
      return String(financialStore.getGuestCount);
    };

    const isAdmin = () => {
      return userStore.isAdmin;
    };

    const guestInfoDialog = ref(false);
    const addGuestDialog = ref(false);

    //PrimeDialog controls

    const guestInfo = () => {
      guestInfoDialog.value = true;
    };

    return {
      userStore,
      financialStore,
      guestCount,
      isAdmin,
      guestInfoDialog,
      addGuestDialog,
      guestInfo,
      activeMessage,
      message,
      loading,
    };
  },
  components: { GuestList, RegistrationList, PageHeader, TableList },
};
</script>

<template>
  <main class="individual-table-view">
    <PageHeader class="pageheader">Manage Table Details</PageHeader>

    <ProgressSpinner v-if="loading" />
    <div v-else class="page-body">
      <TableList :tableID="id" :detailsView="true" />

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
      </div>
      <GuestList :tableID="id" />

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
      ></PrimeDialog>
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
