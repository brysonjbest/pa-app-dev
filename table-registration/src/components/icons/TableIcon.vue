<!-- PageHeader Common Component -->
<template>
  <div class="table-icon">
    <ul class="circle-container">
      <i :class="tableClass"></i>
      <li class="table-seat" v-for="seat of fullSeats" :key="seat">
        <i :class="seat.class"></i>
      </li>
    </ul>
    <div class="table-name">{{ tableName }}</div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    tableStatus: String,
    tableName: String,
    tableOrg: String,
    table: Object,
  },
  setup(props) {
    const fullIcon = "pi pi-circle-fill full-table";
    const halfIcon = "pi pi-circle-fill half-table";
    const emptyIcon = "pi pi-circle empty-table";
    const defaultIcon = "pi pi-circle-fill default-table";

    const tableClass = computed(() => {
      if (props.tableStatus === "full-table") {
        return fullIcon;
      }
      if (props.tableStatus === "half-table") {
        return halfIcon;
      }
      if (props.tableStatus === "empty-table") {
        return emptyIcon;
      }
      return defaultIcon;
    });

    const availSeats = computed(() => {
      console.log(
        "testing avail seats",
        props.table.tablecapacity,
        props.table.guests.length
      );
      return props.table.tablecapacity - props.table.guests.length;
    });

    const fullSeats = computed(() => {
      return props.table.tablecapacity - availSeats;
    });

    console.log("avail seats", availSeats, "full seats", fullSeats);

    return {
      tableClass,
      availSeats,
      fullSeats,
    };
  },
};
</script>

<style lang="scss">
@mixin distribute-on-circle(
  $nb-items,
  $circle-size,
  $item-size,
  $class-for-IE: false
) {
  $half-item: calc($item-size / 2);
  $half-parent: calc($circle-size / 2);

  position: relative; /* 1 */
  width: $circle-size;
  height: $circle-size;
  padding: 0;
  border-radius: 50%;
  list-style: none; /* 2 */
  box-sizing: content-box; /* 3 */

  > * {
    /* 4 */
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: $item-size;
    height: $item-size;
    margin: -$half-item;
  }

  $angle: calc(360 / $nb-items);
  $rot: 0;

  @for $i from 1 through $nb-items {
    @if not $class-for-IE {
      > :nth-of-type(#{$i}) {
        transform: rotate($rot * 1deg)
          translate($half-parent)
          rotate($rot * -1deg);
      }
    } @else {
      > .#{$class-for-IE}#{$i} {
        // If CSS transforms are not supported
        $mt: sin($rot * pi() / 180) * $half-parent - $half-item;
        $ml: cos($rot * pi() / 180) * $half-parent - $half-item;
        margin: $mt 0 0 $ml;
      }
    }

    $rot: ($rot + $angle);
  }
}
.table-icon {
  $fullColor: red;
  $emptyColor: green;
  $defaultColor: purple;
  $tableSize: 4rem;

  .circle-container {
    @include distribute-on-circle(8, 20em, 6em, false);
    margin: 5em auto 0;
    border: solid 5px tomato;
  }

  .circle-container .table-seat {
    display: block;
    width: 100%;
    border-radius: 50%;
    filter: grayscale(100%);

    &:hover {
      filter: grayscale(0);
    }
  }

  .full-table {
    color: $fullColor;
    font-size: $tableSize;
  }
  .half-table {
    background: -moz-linear-gradient(right, $fullColor 50%, $emptyColor 51%);
    background: -webkit-linear-gradient(right, $fullColor 50%, $emptyColor 51%);
    background: linear-gradient(to right, $fullColor 50%, $emptyColor 51%);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: $tableSize;
  }
  .empty-table {
    color: $emptyColor;
    font-size: $tableSize;
  }
  .default-table {
    color: $defaultColor;
    font-size: $tableSize;
  }
}
</style>
