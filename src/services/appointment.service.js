import createApiClient from "./api.service";

class AppointmentService {
    constructor(baseUrl = "/api/appointments") {
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

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async get_status(status) {
        return (await this.api.get(`?trangthai=${status}`)).data;
    }

    async get_date(date) {
        return (await this.api.get(`?ngaythangnam=${date}`)).data;
    }

    async get_doctor(maBS) {
        return (await this.api.get(`?maBS=${maBS}`)).data;
    }

    async get_patient(maBN) {
        return (await this.api.get(`?maBN=${maBN}`)).data;
    }

    async get_specialties(maCK) {
        return (await this.api.get(`?maCK=${maCK}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new AppointmentService();