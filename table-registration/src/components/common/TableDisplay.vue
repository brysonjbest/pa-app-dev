<!-- Use an object array of tables to generate an icon layout -->
<template>
  <div>
    <TableIcon
      v-for="table of tables"
      :key="table"
      :tableStatus="table.status"
    />
  </div>
</template>

<script>
import TableIcon from "../icons/TableIcon.vue";

export default {
  props: {
    tables: Array,
    columns: Array,
  },

  components: {
    TableIcon,
  },
};
</script>
<style></style>
