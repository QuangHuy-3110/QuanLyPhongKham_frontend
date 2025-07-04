<template>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-secondary-subtle">
        <!-- Container wrapper -->
        <div class="container">
            <!-- Navbar brand -->
            <a href="#" class="d-flex align-items-center p-3"
                style="max-width: 250px; margin-right: 200px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/2222/2222671.png" width="60" class="me-2">
                <p class="mb-0 fw-bold fs-2 text-muted"
                    style="font-family: 'Poppins', sans-serif; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">
                    Clinic
                </p>
            </a>

            <!-- Toggle button -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>

            <!-- Collapsible wrapper -->
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <!-- Left links -->
                <ul class="navbar-nav d-flex justify-content-evenly w-100 mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link d-flex flex-column align-items-center text-center"
                           :class="{ 'active': activeNav === 'trangchu' }" href="#"
                           @click="changeNav_value('trangchu')">
                            <i class="fa-solid fa-home my-2 fs-5"></i>
                            <span class="small">Trang chủ</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-flex flex-column align-items-center text-center"
                           :class="{ 'active': activeNav === 'lichkham' }" href="#"
                           @click="changeNav_value('lichkham')">
                            <i class="fa-solid fa-paper-plane my-2 fs-5"></i>
                            <span class="small">Lịch khám</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-flex flex-column align-items-center text-center"
                           :class="{ 'active': activeNav === 'benhnhan' }" href="#"
                           @click="changeNav_value('benhnhan')">
                            <i class="fa-solid fa-book my-2 fs-5"></i>
                            <span class="small">Bệnh nhân</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-flex flex-column align-items-center text-center"
                           :class="{ 'active': activeNav === 'lichhen' }" href="#"
                           @click="changeNav_value('lichhen')">
                            <i class="fa-solid fa-clock my-2 fs-5"></i>
                            <span class="small">Lịch hẹn</span>
                        </a>
                    </li>
                    <!-- Dropdown -->
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#"
                           id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="https://cdn-icons-png.flaticon.com/512/748/748493.png" class="rounded-circle"
                                 height="50" alt="" loading="lazy" />
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <li><a class="dropdown-item btn btn-primary" data-bs-toggle="modal"
                                   data-bs-target="#profileModal">Hồ sơ</a></li>
                            <li><a class="dropdown-item" href="#" data-bs-toggle="modal"
                                   data-bs-target="#staticBackdropmk">Đổi mật khẩu</a></li>
                            <li><a class="dropdown-item" href="#">Đăng xuất</a></li>
                        </ul>
                    </li>
                </ul>
                <!-- Left links -->
            </div>
            <!-- Collapsible wrapper -->
        </div>
        <!-- Container wrapper -->
    </nav>
    <!-- Navbar -->
</template>

<style>
.navbar-nav .nav-link {
    color: #6b7280; /* text-gray-500 */
    transition: all 0.3s ease;
}
.navbar-nav .nav-link:hover {
    color: #2563eb; /* text-blue-600 */
    background-color: rgba(0, 0, 0, 0.05); /* Hiệu ứng nền khi hover */
    border-radius: 0.25rem;
}
.navbar-nav .nav-link.active {
    color: #2563eb; /* text-blue-600 */
    background-color: rgba(37, 99, 235, 0.1); /* Nền nhẹ khi active */
    border-bottom: 2px solid #2563eb; /* Viền dưới khi active */
    border-radius: 0.25rem;
}
.navbar-nav .nav-link.active i {
    transform: scale(1.2); /* Phóng to icon khi active */
}
.navbar-nav .nav-link i {
    transition: transform 0.3s ease; /* Hiệu ứng chuyển đổi mượt mà */
}
</style>

<script>
export default {
    data() {
        return {
            activeNav: 'trangchu' // Mặc định chọn "Trang chủ"
        };
    },
    emits: ["change:nav_value"],
    methods: {
        changeNav_value(name) {
            this.activeNav = name; // Cập nhật trạng thái active
            this.$emit("change:nav_value", name);
        }
    },

    mounted(){
        this.changeNav_value('trangchu')
    }
}
</script>