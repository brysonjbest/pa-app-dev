import { defineStore } from "pinia";
import apiRoutes from "../services/api-routes.services";

export const useFinancialStore = defineStore({
  id: "financialStore",
  state: () => {
    return {
      registration: {
        guid: "",
        organization: "",
        branch: "",
        primarycontact: "",
        primaryemail: "",
        financialcontact: "",
        clientministry: null,
        respcode: null,
        serviceline: null,
        stob: null,
        project: null,
      },
    };
  },
  getters: {
    getId() {
      console.log("testing getId", this.registration);
      return this.registration._id;
    },
  },
  actions: {
    async fill(registrationId) {
      this.registration = await apiRoutes.getRegistration(registrationId);
    },

    async registerFinancialInformation(registrationData) {
      delete registrationData["guid"];
      const newRegistration = await apiRoutes.createRegistration(
        registrationData
      );
      this.registration = newRegistration.data;
    },
  },
});
