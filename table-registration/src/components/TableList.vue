<template>
  <div>
    <DataTable :value="data" responsiveLayout="scroll">
      <PrimeColumn
        v-for="col of columns"
        :field="col.field"
        :header="col.text"
        :key="col.field"
      ></PrimeColumn>
    </DataTable>
  </div>
</template>

<script>
// import { ref } from "vue";

export default {
  props: {
    data: Array,
    columns: Array,
  },
};
</script>
