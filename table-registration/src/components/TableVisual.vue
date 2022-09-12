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
      <TableDisplay :tables="tables" :key="key" />
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
  props: {
    key: Number,
  },
  setup() {
    const financialStore = useFinancialStore();
    const { registrations } = storeToRefs(useFinancialStore());

    const registrationTables = ref({});

    const lookupKey = function (key, value) {
      return formServices.lookup(key, value);
    };

    const tableStore = useTablesStore();
    const { tables } = storeToRefs(useTablesStore());

    // console.log(tables.value, "this is original");

    const computedTables = computed(() => {
      console.log(tables.value, "this is tables");
      return tables.value.sort((a, b) => a.tablename - b.tablename);
    });

    // console.log(tables, "this is modified");

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
      fillList()
        .then(() => {
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
            table.registrationOrganizations = computed(() => {
              const newTableData = table.organizations.map(
                (x) => x.organization
              );
              const dataSet = new Set(newTableData);
              const newArray = Array.from(dataSet);
              const formattedArray = newArray
                .map((x) => (x ? lookupKey("organizations", x) : ""))
                .join("\r\n");
              return formattedArray;
            });
          });
        })
        .then(() => {
          tables.value.sort((a, b) => {
            const nameA = a.tablename[0];
            const numberA = a.tablename[1];
            const nameB = b.tablename[0];
            const numberB = b.tablename[1];

            if (numberA === numberB && nameA >= nameB) {
              return 1;
            }
            if (nameA > nameB && numberA < numberB) {
              return -1;
            }
            return 0;
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
      computedTables,
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
