import createApiClient from "./api.service";

class LogService {
    constructor(baseUrl = "/api/logs") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get()).data;
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

    async get_distributor(maNPP) {
        return (await this.api.get(`?maNPP=${maNPP}`)).data;
    }

    async get_date(date) {
        return (await this.api.get(`?ngaygoi=${date}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new LogService();