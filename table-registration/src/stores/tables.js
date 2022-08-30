import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import tableRoutes from "../services/api-routes.tables.js";
import { useFinancialStore } from "./financial";
import { useGuestsStore } from "./guests";
import formServices from "../services/settings.services";

export const useTablesStore = defineStore({
  id: "tablesStore",
  state: () => {
    return {
      table: {
        tablename: "",
        tablecapacity: null,
        guests: [],
      },
      tables: [],
    };
  },
  getters: {
    getTablesCount() {
      return this.tables.length;
    },
    getGuestCount() {
      return this.table.guests.length;
    },
    getIsFull() {
      return this.table.guests.length >= this.table.tablecapacity
        ? true
        : false;
    },
  },
  actions: {
    async fillGuestsTable(guid) {
      const tableList = await (
        await tableRoutes.getGuestsByTable(guid)
      ).data[0];
      this.tables = tableList.guests || [];
    },

    async fillTables() {
      //this.guests = await tableRoutes.getGuestByRegistration(registrationID);
      this.tables = await (await tableRoutes.getAllTables()).data;
    },

    async fillTable(guid) {
      this.tables = await (await tableRoutes.getTable(guid)).data;
      this.table = this.tables[0];
    },

    async fillOnlyTable(guid) {
      const tableData = await tableRoutes.getTable(guid);
      this.table = tableData.data[0];
      return tableData.data[0];
    },

    async generateNewEventTables() {
      await tableRoutes.createDefaultArrangment();
    },

    //Fully generates a seating plan based on organization and attendee role.
    // Attempts to combine as many individuals to tables as possible.

    async fillEventTables() {
      await useFinancialStore().fillAllRegistrations();
      await useGuestsStore().fillGuests();
      const { registrations } = storeToRefs(useFinancialStore());
      const { guests } = storeToRefs(useGuestsStore());
      const tableList = {};

      const roles = ref(
        (formServices.get("attendancetypes") || []).map((each) => each.value)
      );

      registrations.value.sort((a, b) =>
        a.organization > b.organization
          ? 1
          : b.organization > a.organization
          ? -1
          : 0
      );

      this.tables.map((table) => (table.full = false));

      registrations.value.forEach((registration) => {
        registration.details = [];
        registration.guests.forEach((guest) => {
          registration.details.push(
            guests.value.filter((each) => each._id === guest)[0]
          );
        });
        registration.details.map(
          (guest) =>
            (guest["order"] = roles.value.findIndex(
              (each) => each === guest["attendancetype"]
            ))
        );

        registration.details.sort((a, b) =>
          a.order > b.order ? 1 : b.order > a.order ? -1 : 0
        );
        registration.details.forEach((guest) => {
          this.tables.forEach((table) => {
            if (table.full !== true) {
              tableList[table._id] = tableList[table._id] || [];
              if (!guest.seated) {
                tableList[table._id].push(guest._id);
                table.guests.push(guest);
                guest.seated = true;

                if (table.tablecapacity - table.guests.length === 0) {
                  table.full = true;
                }
              }
            }
          });
        });
      });

      this.tables.forEach(async (table) => {
        table.guests.forEach(async (guest) => {
          await useGuestsStore().addGuestToTable(
            guest._id,
            { table: table },
            table
          );
        });
      });
    },

    async addTable() {
      const {
        tablename = "",
        guid = "",
        tablecapacity = null,
      } = this.table || {};

      this.tables.push({
        tablename,
        guid,
        tablecapacity,
      });
    },

    async updateTable(id, tableData) {
      await tableRoutes.updateTable(id, tableData);
    },

    async registerTable(guid, tableData) {
      const id = guid || this.table._id;
      const newTable = await tableRoutes.updateTable(id, tableData);
      this.table = newTable.data;
      return this.table;
    },

    async registerTableHandler(tableData) {
      const id = tableData["_id"] || "";
      if (await tableRoutes.getTable(id)) {
        const updatedTable = await tableRoutes.updateTable(id, tableData);
        this.table = updatedTable.data;
        return this.table;
      } else {
        const newTable = await tableRoutes.createTable(tableData);
        this.table = newTable.data;
        return this.table;
      }
    },

    async deleteTable(id) {
      await tableRoutes.deleteTable(id);
    },
  },
});
