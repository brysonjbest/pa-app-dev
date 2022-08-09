<!-- Navbar common component -->
<template>
  <div>
    <div class="card">
      <h5>{{ title }}</h5>
      <TabMenu
        class="admin-nav"
        :model="menuitems"
        :activeIndex="activeIndex"
      />
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

<style lang="scss">
.admin-nav {
  color: blue !important;
  .p-tabmenu-nav {
    color: blue !important;
    .p-tabmenuitem {
      color: blue !important;
    }
  }
  .p-tabmenuitem {
    color: blue;
  }
}
</style>
