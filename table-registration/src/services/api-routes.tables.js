import api from "./api.services";
class SeatingDataService {
  getAllTables() {
    return api.get("/tables/seating/");
  }

  getTable(guid) {
    return api.get(`/tables/seating/${guid}`);
  }

  getGuestsByTable(guid) {
    return api.get(`/tables/seating/${guid}/guests`);
  }

  createTable(data) {
    return api.post("/tables/seating/", data);
  }

  createDefaultArrangment(data) {
    return api.post("/tables/seating/newevent/", data);
  }

  updateTable(id, data) {
    return api.post(`/tables/seating/${id}`, data);
  }
  deleteTable(id) {
    return api.post(`/tables/seating/delete/${id}`);
  }
}
export default new SeatingDataService();
