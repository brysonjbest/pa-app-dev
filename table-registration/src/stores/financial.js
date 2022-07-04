import { defineStore } from "pinia";

export const useFinancialStore = defineStore({
  id: "financialStore",
  state: () => {
    return {
      registration: {
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
  getters: {},
  actions: {},
});
