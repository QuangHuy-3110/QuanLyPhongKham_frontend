import createApiClient from "./api.service";

class DrugService {
    constructor(baseUrl = "/api/drug") {
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

    async get_minnum() {
        try {
            // Gọi API đúng endpoint
            const response = await this.api.get('/');
            const medicines = response.data;

            if (!medicines || medicines.length === 0) {
                throw new Error('Không tìm thấy thuốc nào từ API');
            }

            // Lọc các thuốc có soluongThuoc <= soluong_minThuoc
            const filteredMedicines = medicines.filter(
                (medicine) => medicine.soluongThuoc <= medicine.soluong_minThuoc
            );

            if (filteredMedicines.length === 0) {
                throw new Error(
                    'Không tìm thấy thuốc nào có số lượng nhỏ hơn hoặc bằng số lượng tối thiểu'
                );
            }

            return filteredMedicines;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thuốc:', error);
            throw new Error(
                error.response?.data?.message ||
                error.message ||
                'Lỗi khi lấy danh sách thuốc'
            );
        }
    }

    async get_place(place) {
        return (await this.api.get(`?noisanxuat=${place}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new DrugService();