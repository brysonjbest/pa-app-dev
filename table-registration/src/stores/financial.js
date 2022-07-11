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
    async fill(guid) {
      this.registration = await apiRoutes.getRegistration(guid);
      return this.registration;
    },

    async createRegistration(guid) {
      const newRegistration = await apiRoutes.createRegistration({ guid });
      this.registration = newRegistration.data;
      return this.registration;
    },

    async registerFinancialInformation(registrationData) {
      const id = this.registration._id;
      const newRegistration = await apiRoutes.updateRegistration(
        id,
        registrationData
      );
      this.registration = newRegistration.data;
      return this.registration;
    },
  },
});
