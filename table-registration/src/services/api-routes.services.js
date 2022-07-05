import api from "./api.services";
class TablesDataService {
  getAllGuests() {
    return api.get("/guests");
  }

  getGuest(id) {
    return api.get(`/guests/${id}`);
  }

  getGuestByRegistration(registrationID) {
    return api.get(`/guests/${registrationID}`);
  }

  createGuest(data) {
    return api.post("/guests", data);
  }

  deleteGuest(id) {
    return api.delete(`/guests/${id}`);
  }

  updateGuest(id, data) {
    return api.put(`/guests/${id}`, data);
  }

  getAllRegistrations() {
    return api.get("/registrations");
  }

  getRegistration(id) {
    return api.get(`/registrations/${id}`);
  }

  createRegistration(data) {
    return api.post("/registrations", data);
  }

  updateRegistration(id, data) {
    return api.put(`/registrations/${id}`, data);
  }
  deleteRegistration(id) {
    return api.delete(`/registrations/${id}`);
  }
  //   deleteAll() {
  //     return api.delete(`/registrations`);
  //   }
  findBy(name) {
    return api.get(`/guests?name=${name}`);
  }
}
export default new TablesDataService();
