import { defineStore } from "pinia";
import apiRoutes from "../services/api-routes.services";
import { useFinancialStore } from "./financial";

export const useGuestsStore = defineStore({
  id: "guestsStore",
  state: () => {
    return {
      guest: {
        registration: "",
        firstname: "",
        lastname: "",
        attendancetype: "",
        organization: "",
        accessibility: [],
        dietary: [],
      },
      guests: [],
    };
  },
  getters: {},
  actions: {
    async fillGuests() {
      //this.guests = await apiRoutes.getGuestByRegistration(registrationID);
      this.guests = await (await apiRoutes.getAllGuests()).data;
    },
    async addRegistrationData() {
      console.log("registrationdata add");
      const registrationData = useFinancialStore();
      this.guest.registration = await registrationData.getId;
    },
    async addGuestList() {
      const {
        guid = "",
        firstname = "",
        lastname = "",
        attendancetype = "",
        organization = "",
        accessibility = [],
        dietary = [],
      } = this.guest || {};

      await this.guests.push({
        guid,
        firstname,
        lastname,
        attendancetype,
        organization,
        accessibility,
        dietary,
      });
    },
    async updateGuest(id, guestData) {
      await apiRoutes.updateGuest(id, guestData);
    },

    async deleteGuest(id) {
      await apiRoutes.deleteGuest(id);
    },

    async registerGuest(guestData) {
      // await apiRoutes.createGuest(guestData);
      const newGuest = await apiRoutes.createGuest(guestData);
      this.guest["guid"] = newGuest.data["guid"];
      return this.guest;
    },

    async registerAllGuests() {
      for (let each of this.guests) {
        this.registerGuest(each);
      }
    },
  },
});
