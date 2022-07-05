<template>
  <div>
    <DataTable :value="guests" responsiveLayout="scroll">
      <Column
        v-for="col of columns"
        :field="col.field"
        :header="col.text"
        :key="col.field"
      ></Column>
    </DataTable>
  </div>
</template>

<script>
import formServices from "../services/settings.services";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useGuestsStore } from "../stores/guests";

export default {
  setup() {
    const guestStore = useGuestsStore();
    const columns = ref(formServices.get("guestSelection") || []);
    guestStore.fillGuests();
    //const guests = guestStore.guests;
    const { guests } = storeToRefs(useGuestsStore());

    return { columns, guests };
  },
};
</script>
