import createApiClient from "./api.service";

class ExaminationService {
    constructor(baseUrl = "/api/examinations") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get(`?xoa=${0}`)).data;
    }

    async getDel() {
        return (await this.api.get(`?xoa=${1}`)).data;
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

    async get_profile(profile) {
        return (await this.api.get(`?maHS=${profile}`)).data;
    }

    async get_doctor(maBS) {
        return (await this.api.get(`?maBS=${maBS}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new ExaminationService();