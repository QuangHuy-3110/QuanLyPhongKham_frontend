<template>
    <div class="col-3 px-2 bg-dark-subtle" style="width: 20%;">
        <div id="sidebar" class="collapse collapse-horizontal show border-end bg-secondary-subtle">
            <div id="sidebar-nav" class="list-group border-0 rounded-0 text-sm-start min-vh-100">
                <div class="accordion" id="accordionExample">
                    <div class="accordion-item p-3">
                        <h2 class="accordion-header">
                            <!-- <button type="button"> -->
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('dashboard')">
                                    <i class="bi bi-house-door-fill"></i> <span class="fw-semibold" style="font-size: 1.125rem;">Tổng quan</span>
                                </a>
                            <!-- </button> -->
                        </h2>
                    </div>

                    <div class="accordion-item p-3">
                        <h2 class="accordion-header">
                            <!-- <button type="button"> -->
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('support')">
                                    <i class="bi bi-headset"></i> <span class="fw-semibold" style="font-size: 1.125rem;">Hỗ trợ khách hàng</span>
                                </a>
                            <!-- </button> -->
                        </h2>
                    </div>

                    <!-- Quản lý bác sĩ -->
                    <div class="accordion-item p-3">
                        <h2 class="accordion-header">
                            <button class="accordion-button list-group-item" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                <i class="bi bi-person-circle me-2"></i> <span class="fw-semibold" style="font-size: 1.125rem;">Quản lý bác sĩ</span>
                            </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show bg-dark-subtle "
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('themBS')">
                                    <i class="bi bi-person-plus me-2"></i> <span class="fs-6 text-dark">Thêm bác sĩ</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemBS')">
                                    <i class="bi bi-list-ul me-2"></i> <span class="fs-6 text-dark">Xem danh sách bác sĩ</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('themlichBS')">
                                    <i class="bi bi-calendar-plus me-2"></i> <span class="fs-6 text-dark">Thêm lịch làm việc</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemlichBS')">
                                    <i class="bi bi-calendar-check me-2"></i> <span class="fs-6 text-dark">Xem lịch làm việc</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemBS_Xoa')">
                                    <i class="bi bi-trash3 me-2"></i><span class="fs-6 text-dark">Xem bác sĩ đã xóa</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Quản lý bệnh nhân -->
                    <div class="accordion-item p-3">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false"
                                aria-controls="collapseTwo">
                                <i class="bi bi-person-hearts me-2"></i> <span class="fw-semibold" style="font-size: 1.125rem;">Quản lý bệnh nhân</span>
                            </button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('themBN')">
                                    <i class="bi bi-person-plus me-2"></i> <span class="fs-6 text-dark">Thêm bệnh nhân</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemBN')">
                                    <i class="bi bi-list-ul me-2"></i> <span class="fs-6 text-dark">Xem danh sách bệnh nhân</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemBN_Xoa')">
                                    <i class="bi bi-trash3 me-2"></i> <span class="fs-6 text-dark">Xem bệnh nhân đã xóa</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Quản lý thuốc -->
                    <div class="accordion-item p-3">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false"
                                aria-controls="collapseThree">
                                <i class="bi bi-capsule me-2"></i> <span class="fw-semibold" style="font-size: 1.125rem;">Quản lý thuốc</span>
                            </button>
                        </h2>
                        <div id="collapseThree" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('themThuoc')">
                                    <i class="bi bi-plus-circle me-2"></i> <span class="fs-6 text-dark">Thêm thuốc</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemThuoc')">
                                    <i class="bi bi-list-ul me-2"></i> <span class="fs-6 text-dark">Xem danh sách thuốc</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemThuocmin')">
                                    <i class="bi bi-exclamation-triangle me-2"></i> <span class="fs-6 text-dark">Xem danh sách thuốc gần hết</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemThuoc_Xoa')">
                                    <i class="bi bi-trash3 me-2"></i> <span class="fs-6 text-dark">Xem thuốc đã xóa</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemNK')">
                                    <i class="bi bi-journal-text me-2"></i> <span class="fs-6 text-dark">Xem nhật kí đặt thuốc</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Quản lý chuyên khoa -->
                    <div class="accordion-item p-3">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false"
                                aria-controls="collapseFour">
                                <i class="bi bi-heart-pulse me-2"></i> <span class="fw-semibold" style="font-size: 1.125rem;">Quản lý chuyên khoa</span>
                            </button>
                        </h2>
                        <div id="collapseFour" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('themCK')">
                                    <i class="bi bi-plus-circle me-2"></i> <span class="fs-6 text-dark">Thêm chuyên khoa</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemCK')">
                                    <i class="bi bi-list-ul me-2"></i> <span class="fs-6 text-dark">Xem danh sách chuyên khoa</span>
                                </a>
                            </div>
                        </div>
                    </div>

                     <!-- Quản lý nhà cung cấp -->
                    <div class="accordion-item p-3">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false"
                                aria-controls="collapseSeven">
                                <i class="bi bi-truck me-2"></i> <span class="fw-semibold" style="font-size: 1.125rem;">Quản lý nhà cung cấp</span>
                            </button>
                        </h2>
                        <div id="collapseSeven" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                    @click="changeNav_value('themNPP')">
                                    <i class="fa-solid fa-plus me-2"></i> <span class="fs-6 text-dark">Thêm nhà cung cấp</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                    @click="changeNav_value('xemNPP')">
                                    <i class="fa-regular fa-address-book me-2"></i> <span class="fs-6 text-dark">Xem nhà cung cấp</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                    @click="changeNav_value('xemNPP_Xoa')">
                                    <i class="bi bi-trash3 me-2"></i> <span class="fs-6 text-dark">Xem nhà cung cấp đã xóa</span>
                                </a>
                            </div>
                        </div>
                    </div>

                <!-- Quản lý hóa đơn -->
                    <div class="accordion-item p-3">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false"
                                aria-controls="collapseEight">
                                <i class="bi bi-receipt me-2"></i> <span class="fw-semibold" style="font-size: 1.125rem;">Quản lý hóa đơn</span>
                            </button>
                        </h2>
                        <div id="collapseEight" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                    @click="changeNav_value('themHD')">
                                    <i class="fa-solid fa-plus me-2"></i> <span class="fs-6 text-dark">Thêm hóa đơn</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                    @click="changeNav_value('xemHD')">
                                    <i class="bi bi-list-ul me-2"></i> <span class="fs-6 text-dark">Xem hóa đơn</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Quản lý hồ sơ bệnh án -->
                    <div class="accordion-item p-3">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false"
                                aria-controls="collapseSix">
                                <i class="bi bi-file-medical me-2"></i> <span class="fw-semibold" style="font-size: 1.125rem;">Quản lý hồ sơ bệnh án</span>
                            </button>
                        </h2>
                        <div id="collapseSix" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemBAn')">
                                    <i class="bi bi-list-ul me-2"></i> <span class="fs-6 text-dark">Xem hồ sơ bệnh án</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemBAn_Xoa')">
                                    <i class="bi bi-trash3 me-2"></i> <span class="fs-6 text-dark">Xem hồ sơ bệnh án đã xóa</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Giải quyết lịch hẹn -->
                    <div class="accordion-item p-3">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false"
                                aria-controls="collapseFive">
                                <i class="bi bi-calendar-event me-2"></i> <span class="fw-semibold" style="font-size: 1.125rem;">Giải quyết lịch hẹn</span>
                            </button>
                        </h2>
                        <div id="collapseFive" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xulyLH')">
                                    <i class="bi bi-check-circle me-2"></i> <span class="fs-6 text-dark">Xử lý cuộc hẹn</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('xemLH')">
                                    <i class="bi bi-list-ul me-2"></i> <span class="fs-6 text-dark">Xem danh sách cuộc hẹn</span>
                                </a>
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('themLH')">
                                    <i class="bi bi-list-ul me-2"></i> <span class="fs-6 text-dark">Tạo lịch hẹn</span>
                                </a>
                            </div>
                        </div>
                    </div>
                <!-- </div> -->


                <!-- Xem biểu đồ -->
                    <div class="accordion-item p-3">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseNine" aria-expanded="false"
                                aria-controls="collapseNine">
                                <i class="bi bi-graph-up me-2"></i> <span class="fw-semibold" style="font-size: 1.125rem;">Thống kê</span>
                            </button>
                        </h2>
                        <div id="collapseNine" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white"
                                   @click="changeNav_value('chart')">
                                    <i class="bi bi-bar-chart-line me-2"></i> <span class="fs-6 text-dark">Thống kê thu chi</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

           

                <a href="#" class="list-group-item border-end-0 rounded-3 mt-2 d-inline-block text-truncate bg-success text-white p-3"
                   @click="changeNav_value('refresh')">
                    <i class="bi bi-arrow-repeat me-2"></i> <span class="fs-6 fw-semibold text-white">Làm mới</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeNav: '' 
        };
    },
    emits: ["change:nav_value"],
    methods: {
        changeNav_value(name) {
            this.activeNav = name;
            this.$emit("change:nav_value", name);
        }
    },
    mounted() {
    }
}
</script>

<style>
/* Đảm bảo icon hiển thị đúng */
.bi {
    font-size: 1.2rem;
    vertical-align: middle;
}
</style>