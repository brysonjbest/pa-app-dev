import { defineStore } from "pinia";
import tableRoutes from "../services/api-routes.tables.js";
import { useFinancialStore } from "./financial";
import { useGuestsStore } from "./guests";

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

    async generateNewEventTables() {
      const guestStore = useGuestsStore();
      const totalGuests = guestStore.getGuestsCount;
      await tableRoutes.createDefaultArrangment({ guestCount: totalGuests });
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

    async deleteTable(id) {
      await tableRoutes.deleteTable(id);
    },
  },
});
