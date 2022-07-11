import api from "./api.services";

class UsersDataService {
  getAllUsers() {
    return api.get("/users");
  }

  getGuest(id) {
    return api.get(`/users/guests/${id}`);
  }

  getUserByRegistration(registrationID) {
    return api.get(`/users/${registrationID}`);
  }

  createUser(data) {
    return api.post("/users", data);
  }

  deleteUser(id) {
    return api.post(`/users/delete/${id}`);
  }

  updateUser(id, data) {
    return api.post(`/users/${id}`, data);
  }

  findBy(name) {
    return api.get(`/users?firstname=${name}`);
  }
}
export default new UsersDataService();
