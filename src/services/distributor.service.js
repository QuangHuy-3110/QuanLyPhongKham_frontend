import createApiClient from "./api.service";

class DistributorService {
    constructor(baseUrl = "/api/distributors") {
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

    async get_name(name) {
        return (await this.api.get(`?tenNPP=${name}`)).data;
    }

    async get_address(address) {
        return (await this.api.get(`?diachiNPP=${address}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new DistributorService();