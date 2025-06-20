import createApiClient from "./api.service";

class DoctorRoleService {
    constructor(baseUrl = "/api/doctor-role") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async deleteAll() {
        return (await this.api.delete("/")).data;
    }

    async get(id1, id2) {
        return (await this.api.get(`/${id1}?maCK=${id2}`)).data;
    }

    async get_doctor(doctor) {
        return (await this.api.get(`?maBS=${doctor}`)).data;
    }

    async get_specialties(maCK) {
        return (await this.api.get(`?maCK=${date}`)).data;
    }

    async update(id1, id2, data) {
        return (await this.api.put(`/${id1}?maCK=${id2}`, data)).data;
    }

    async delete(id1, id2) {
        return (await this.api.delete(`/${id1}?maCK=${id2}`)).data;
    }
}
export default new DoctorRoleService();