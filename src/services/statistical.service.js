import createApiClient from "./api.service";

class StatisticalService {
    constructor(baseUrl = "/api/statistical") {
        this.api = createApiClient(baseUrl);
    }

    // 1️⃣ Lấy thống kê tổng số bệnh nhân và số bệnh nhân đã kích hoạt
    async getBenhNhanStats() {
        return (await this.api.get("/benhnhan-stats")).data;
    }

    // 2️⃣ Lấy số lịch hẹn chưa khám
    async getLichHenChuaKham() {
        return (await this.api.get("/lichhen-chuakham")).data;
    }

    // 3️⃣ Lấy số lượng hồ sơ khám bệnh
    async getHoSoKhamBenh() {
        return (await this.api.get("/hoso-khambenh")).data;
    }

    // 4️⃣ Lấy số lượng bác sĩ
    async getSoLuongBacSi() {
        return (await this.api.get("/soluong-bacsi")).data;
    }

    // 5️⃣ Lấy thống kê thu chi (chi tiết theo ngày và theo tháng)
    async getThuChiStats() {
        return (await this.api.get("/thuchi-stats")).data;
    }

    // 6️⃣ Lấy thống kê từng bác sĩ (số buổi làm, giờ làm, bệnh nhân theo tháng/năm)
    async getBacSiStats() {
        return (await this.api.get("/bacsi-stats")).data;
    }
}

export default new StatisticalService();