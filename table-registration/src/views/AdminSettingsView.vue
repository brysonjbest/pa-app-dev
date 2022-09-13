<script setup>
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { useTablesStore } from "../stores/tables";
import { useGuestsStore } from "../stores/guests";
import { useMessageStore } from "../stores/messages";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import PageHeader from "../components/common/PageHeader.vue";
import formServices from "../services/settings.services";

const userStore = useAuthUserStore();
const financialStore = useFinancialStore();
const guestStore = useGuestsStore();
const fullTableReset = ref(false);
const tableAssignment = ref(false);
const defaultLayoutGenerated = ref(false);

const tableStore = useTablesStore();
const messageStore = useMessageStore();
const { message } = storeToRefs(useMessageStore());
const activeMessage = ref(false);

const toggleMessage = () => {
  activeMessage.value = false;
};

//Table Management Functions - Generate and Fill the default layout
const fillTables = async () => {
  try {
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Algorithmically filling tables...",
      type: "info",
      spinner: true,
    });
    // handle data submission
    financialStore.$reset;
    tableStore.$reset;
    guestStore.$reset;
    await tableStore
      .fillTables()
      .then(async () => {
        await tableStore.fillEventTables();
      })
      .then(() => {
        messageStore.setMessage({
          text: "Successfully filled tables!",
          type: "success",
        });
      })
      .then(() => (defaultLayoutGenerated.value = false));
  } catch (error) {
    console.error(error);
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Tables could not be filled automatically.",
      type: "error",
    });
  }
};

const generateDefaultTables = async () => {
  try {
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Generating required tables...",
      type: "info",
      spinner: true,
    });
    // handle data submission
    await tableStore
      .generateNewEventTables()
      .then(() => {
        messageStore.setMessage({
          text: "Successfully generated tables!",
          type: "success",
        });
      })
      .then(() => (defaultLayoutGenerated.value = true));
  } catch (error) {
    console.error(error);
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Tables could not be generated.",
      type: "error",
    });
  }
};

//Dialog Controls
const resetDialog = ref(false);
const fillDialog = ref(false);

const resetConfirmation = () => {
  resetDialog.value = true;
};

const fillConfirmation = () => {
  fillDialog.value = true;
};

userStore.login();
</script>

<template>
  <main>
    <PageHeader title="Event Settings" subtitle="Update PA Event Details" />
    <div id="siteSettings">
      <PrimeMessage
        show
        v-if="activeMessage"
        :variant="message.type"
        :life="5000"
        :sticky="false"
      >
        <p>
          {{ message.text }}
        </p>
      </PrimeMessage>
      <PrimeCard id="eventDateSettings">
        <template #subtitle>
          <h1>Table Settings</h1>
        </template>
        <template #content>
          <h3>
            Use these settings to reset and generate a new layout of tables for
            the event.
          </h3>
          <ol>
            <li>
              <PrimeButton
                label="Reset All Tables and Generate Default Layout"
                type="button"
                icon="pi pi-ticket"
                class="p-button"
                @click="resetConfirmation()"
              />
            </li>
            <li>
              <PrimeButton
                :disabled="!defaultLayoutGenerated"
                id="fill-tables-button"
                label="Fill Tables"
                type="button"
                icon="pi pi-ticket"
                class="p-button"
                @click="fillConfirmation()"
              />
              <small
                v-if="!defaultLayoutGenerated"
                class="p-error"
                id="fill-tables-button-help"
                >Fill Tables option only available after a reset.</small
              >
            </li>
          </ol>
        </template>
      </PrimeCard>
      <PrimeCard id="eventDateSettings">
        <template #subtitle>
          <h1>Event Date Settings</h1>
        </template>
        <template #content> </template>
      </PrimeCard>
    </div>

    <PrimeDialog
      v-model:visible="resetDialog"
      header="Confirm Reset"
      :modal="true"
      class="p-fluid"
      @hide="toggleMessage()"
    >
      <div v-if="!activeMessage">
        <p>
          This will reset all tables and remove all guests from their current
          table assignment.
          <br />
          This action cannot be undone.
          <br />
        </p>
        <div id="full-table-reset-checkbox">
          <CheckBox
            id="full-table-reset"
            name="full-table-reset"
            value="fulltablereset"
            v-model="fullTableReset"
            :binary="true"
          />
          <label for="full-table-reset"
            >Please confirm that you wish to reset all tables and generate a new
            layout, and that you understand that this action cannot be
            reversed.</label
          >
        </div>
      </div>

      <PrimeButton
        v-if="!activeMessage"
        :disabled="!fullTableReset"
        type="button"
        label="Confirm Table Reset"
        @click="generateDefaultTables()"
        class="p-button-danger"
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
      v-model:visible="fillDialog"
      header="Confirm AutoFill of Tables"
      :modal="true"
      class="p-fluid"
      @hide="toggleMessage()"
    >
      <div v-if="!activeMessage">
        <p>
          This will algorithmically fill the available tables using the default
          sorting method, and can only be used immediately following a full
          reset.
          <br />
          This will first sort reservations to tables alphabetically based on
          the ministry/organization name on the reservation. <br />
          Individuals are then sorted to tables within that reservation based on
          their attendance type (Minister, Deputy Minister, Associate/Assistant
          Deputy Minister, etc.).
          <br />
        </p>
        <div id="table-assignment-checkbox">
          <CheckBox
            id="table-assignment"
            name="table-assignment"
            value="tableAssignment"
            v-model="tableAssignment"
            :binary="true"
          />
          <label for="table-assignment"
            >Please confirm that you wish to use the default sorting algorithim
            to setup the initial table arrangement.</label
          >
        </div>
      </div>

      <PrimeButton
        v-if="!activeMessage"
        :disabled="!tableAssignment"
        type="button"
        label="Confirm Table AutoFill"
        @click="fillTables()"
        class="p-button-success"
        badgeClass="p-badge-success"
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
  </main>
</template>
<style lang="scss">
#siteSettings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .p-card-subtitle {
    margin: 0;
  }
  .p-card-content {
    padding: 0;
    display: flex;
    flex-direction: column;
    button {
      width: fit-content;
    }
  }
}
</style>
