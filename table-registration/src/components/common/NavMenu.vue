<!-- Navbar common component -->
<template>
  <div>
    <div class="card">
      <h5>{{ title }}</h5>
      <TabMenu :model="menuitems" :activeIndex="activeIndex" />
      <RouterView />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    title: String,
    menuitems: Array,
  },
  setup() {
    const activeIndex = ref(0);

    return { activeIndex };
  },
};
</script>

<style scoped></style>
