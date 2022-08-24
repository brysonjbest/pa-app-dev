<!-- Use an object array of tables to generate an icon layout -->
<template>
  <div class="table-display">
    <TableIcon
      v-for="table of tables"
      :key="table"
      :tableStatus="table.status"
      :tableName="table.tablename"
      :table="table"
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
<style lang="scss">
.table-display {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>
