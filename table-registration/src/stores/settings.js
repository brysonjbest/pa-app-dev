import { defineStore } from "pinia";
import settingsRoutes from "../services/api-routes.eventsettings";

export const useSettingsStore = defineStore({
  id: "settingsStore",
  state: () => {
    return {
      settings: {
        year: null,
        salesopen: "",
        salesclose: "",
      },
    };
  },

  getters: {
    getSettings() {
      return this.settings;
    },
  },
  actions: {
    async fillSettings() {
      this.settings = await (await settingsRoutes.getSettings()).data;
    },

    async updateSettings(settingsData) {
      await settingsRoutes.updateSettings(settingsData);
    },

    resetSettings() {
      this.$reset();
    },
  },
});
