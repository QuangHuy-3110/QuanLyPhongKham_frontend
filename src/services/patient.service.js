import createApiClient from "./api.service";

class PatientService {
    constructor(baseUrl = "/api/patients") {
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

    async get_cccd(cccd) {
        return (await this.api.get(`?cccdBN=${cccd}`)).data;
    }

    async get_acname(acname) {
        return (await this.api.get(`?tendangnhapBN=${acname}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new PatientService();