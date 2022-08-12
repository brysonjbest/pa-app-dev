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

    async fillTable(guid) {
      this.tables = await (await tableRoutes.getTable(guid)).data;
    },

    async fillOnlyTable(guid) {
      const tableData = await tableRoutes.getTable(guid);
      this.table = tableData.data[0];
      return tableData.data[0];
    },

    async generateNewEventTables() {
      await tableRoutes.createDefaultArrangment();
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
