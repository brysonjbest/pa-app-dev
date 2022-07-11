import api from "./api.services";
class TablesDataService {
  getAllGuests() {
    return api.get("/tables/guests");
  }

  getGuest(id) {
    return api.get(`/tables/guests/${id}`);
  }

  getGuestByRegistration(registrationID) {
    return api.get(`/tables/guests/${registrationID}`);
  }

  createGuest(data) {
    return api.post("/tables/guests", data);
  }

  deleteGuest(id) {
    return api.post(`/tables/guests/delete/${id}`);
  }

  updateGuest(id, data) {
    return api.post(`/tables/guests/${id}`, data);
  }

  getAllRegistrations() {
    return api.get("/tables/registrations");
  }

  getRegistration(id) {
    return api.get(`/tables/registrations/${id}`);
  }

  createRegistration(data) {
    return api.post("/tables/registrations", data);
  }

  updateRegistration(id, data) {
    return api.put(`/tables/registrations/${id}`, data);
  }
  deleteRegistration(id) {
    return api.delete(`/tables/registrations/${id}`);
  }
  //   deleteAll() {
  //     return api.delete(`/registrations`);
  //   }
  findBy(name) {
    return api.get(`/tables/guests?name=${name}`);
  }
}
export default new TablesDataService();
