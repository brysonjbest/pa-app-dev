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
      registrations: [],
    };
  },
  getters: {
    getId() {
      return this.registration._id;
    },
    getGuid() {
      return this.registration.guid;
    },
  },
  actions: {
    async fill(guid) {
      const registrationData = await apiRoutes.getRegistration(guid);
      this.registration = registrationData.data[0];
      this.registrations = [registrationData.data[0]];
      return registrationData.data[0];
    },

    async fillID(id) {
      const registrationData = await apiRoutes.getRegistrationByID(id);
      this.registration = registrationData.data[0];
      this.registrations = [registrationData.data[0]];
      return registrationData.data[0];
    },

    async fillAllRegistrations() {
      this.registrations = await (await apiRoutes.getAllRegistrations()).data;
    },

    async deleteRegistration(id) {
      await apiRoutes.deleteRegistration(id);
    },

    async createRegistration(guid) {
      const newRegistration = await apiRoutes.createRegistration({ guid });
      this.registration = newRegistration.data;
      return this.registration;
    },

    async registerFinancialInformation(registrationData, regID) {
      const id = regID || this.registration._id;
      const newRegistration = await apiRoutes.updateRegistration(
        id,
        registrationData
      );
      this.registration = newRegistration.data;
      return this.registration;
    },
  },
});
