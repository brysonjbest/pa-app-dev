<!-- Guest Selector for Tables -->
<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}</PrimeMessage
    >
    <div v-else>
      <TableDisplay :tables="tables" />
    </div>
  </div>
</template>

<script>
import { useFinancialStore } from "../stores/financial";
import { useTablesStore } from "../stores/tables";
import { useAuthUserStore } from "../stores/users";
import TableIcon from "./icons/TableIcon.vue";
import TableDisplay from "./common/TableDisplay.vue";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed, onUpdated } from "vue";
import formServices from "../services/settings.services";
import GuestPicker from "./inputs/GuestPicker.vue";

export default {
  setup() {
    const financialStore = useFinancialStore();
    const { registrations } = storeToRefs(useFinancialStore());

    const registrationTables = ref({});

    const tableStore = useTablesStore();
    const { tables } = storeToRefs(useTablesStore());

    const columns = ref(formServices.get("tableSelection") || []);
    const organizations = ref(
      (formServices.get("organizations") || []).map((each) => each.value)
    );

    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });
    const loading = ref(false);

    //Fill tables datatables with appropriate data based on props
    const fillList = async function () {
      financialStore.$reset;
      tableStore.$reset;
      loading.value = true;
      try {
        return await tableStore.fillTables().then(() => {
          financialStore.fillAllRegistrations();
        });
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not fetch tables and/or registrations.",
        };
      } finally {
        loading.value = false;
        setTimeout(() => (message.value = false), 1500);
      }
    };

    const loadLazyData = () => {
      fillList().then(() => {
        tables.value.forEach((table) => {
          table.status = computed(() => {
            if (table.guests.length >= table.tablecapacity) {
              return "full-table";
            }
            if (table.guests.length > 0) {
              return "half-table";
            }
            return "empty-table";
          });
        });
      });
    };

    onMounted(() => {
      loadLazyData();
    });

    return {
      fillList,
      loadLazyData,
      tables,
      registrations,
      organizations,
      message,
      loading,
      messageText,
      tableStore,
      columns,
    };
  },
  components: {
    TableIcon,
    TableDisplay,
    GuestPicker,
  },
};
</script>
<style></style>
