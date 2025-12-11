import createApiClient from "./api.service";

class LeadsService {
    constructor(baseUrl = "/api/leads") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

}
export default new LeadsService();