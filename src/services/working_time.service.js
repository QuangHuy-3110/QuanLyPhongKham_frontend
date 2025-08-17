import createApiClient from "./api.service";

class WorkingTimeService {
    constructor(baseUrl = "/api/working-times") {
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

    async get(id1, id2, id3) {
        return (await this.api.get(`/${id1}?ngaythangnam=${id2}&giobatdau=${id3}`)).data;
    }

    async get_doctor(id1 ) {
        return (await this.api.get(`/?maBS=${id1}`)).data;
    }

    async get_date(date) {
        return (await this.api.get(`/?ngaythangnam=${date}`)).data;
    }

    async update(id1, id2, id3, data) {
        return (await this.api.put(`/${id1}?ngaythangnam=${id2}&giobatdau=${id3}`, data)).data;
    }

    async delete(id1, id2, id3,) {
        return (await this.api.delete(`/${id1}?ngaythangnam=${id2}&giobatdau=${id3}`)).data;
    }
}
export default new WorkingTimeService();