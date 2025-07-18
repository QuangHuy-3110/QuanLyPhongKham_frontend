import createApiClient from "./api.service";

class Invoice_detailsService {
    constructor(baseUrl = "/api/invoice_details") {
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
        return (await this.api.get(`/${id1}?maThuoc=${id2}`)).data;
    }

    async get_invoice(maHD) {
        return (await this.api.get(`?maHD=${maHD}`)).data;
    }

    async get_Drug(drug) {
        return (await this.api.get(`?maThuoc=${drug}`)).data;
    }

    async update(id1, id2, data) {
        return (await this.api.put(`/${id1}?maThuoc=${id2}`, data)).data;
    }

    async delete(id1, id2) {
        return (await this.api.delete(`/${id1}?maThuoc=${id2}`)).data;
    }
}
export default new Invoice_detailsService();