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
                           @click.prevent="changeNav_value('trangchu')">
                            <i class="fa-solid fa-home my-2 fs-5"></i>
                            <span class="small">Trang chủ</span>
                        </a>
                    </li>
                    <li class="nav-item" v-if="isAuthenticated">
                        <a class="nav-link d-flex flex-column align-items-center text-center"
                           :class="{ 'active': activeNav === 'lichkham' }" href="#"
                           @click.prevent="changeNav_value('lichkham')">
                            <i class="fa-solid fa-paper-plane my-2 fs-5"></i>
                            <span class="small">Đặt lịch khám</span>
                        </a>
                    </li>
                    <li class="nav-item" v-if="isAuthenticated">
                        <a class="nav-link d-flex flex-column align-items-center text-center"
                           :class="{ 'active': activeNav === 'hsbenhan' }" href="#"
                           @click.prevent="changeNav_value('hsbenhan')">
                            <i class="fa-solid fa-book my-2 fs-5"></i>
                            <span class="small">Hồ sơ bệnh án</span>
                        </a>
                    </li>
                    <li class="nav-item" v-if="isAuthenticated">
                        <a class="nav-link d-flex flex-column align-items-center text-center"
                           :class="{ 'active': activeNav === 'lichhen' }" href="#"
                           @click.prevent="changeNav_value('lichhen')">
                            <i class="fa-solid fa-clock my-2 fs-5"></i>
                            <span class="small">Lịch hẹn</span>
                        </a>
                    </li>
                    <router-link
                        v-if="!isAuthenticated"
                        :to="{ name: 'loginform' }"
                        class="btn btn-primary btn-lg d-flex align-items-center gap-2"
                    >
                        Đăng nhập
                    </router-link>
                    <router-link
                        v-if="!isAuthenticated"
                        :to="{ name: 'registerform' }"
                        class="btn btn-secondary btn-lg d-flex align-items-center gap-2"
                    >
                        Đăng ký
                    </router-link>
                    <!-- <li class="nav-item dropdown" v-if="isAuthenticated">
                        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#"
                           id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="https://cdn-icons-png.flaticon.com/512/748/748493.png" class="rounded-circle"
                                 height="50" alt="User avatar" loading="lazy" />
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <li><a class="dropdown-item" href="#" data-bs-toggle="modal"
                                   data-bs-target="#staticBackdropmk">Đổi mật khẩu</a></li>
                            <li><a class="dropdown-item" href="#" @click.prevent="logout">Đăng xuất</a></li>
                        </ul>
                    </li> -->
                    <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#staticBackdropmk" v-if="isAuthenticated">Đổi mật khẩu</button>
                    <button class="btn btn-warning" @click.prevent="logout" v-if="isAuthenticated">Đăng xuất</button>

                    <div class="modal fade" id="staticBackdropmk" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1"
                        aria-labelledby="staticBackdropLabelmk" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="staticBackdropLabelmk">Đổi mật khẩu</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <!-- Form đổi mật khẩu sẽ được thêm ở đây -->
                                    <p>Chức năng đổi mật khẩu đang được phát triển.</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    <button type="button" class="btn btn-primary">Lưu thay đổi</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
                <!-- Left links -->
            </div>
            <!-- Collapsible wrapper -->
        </div>
        <!-- Container wrapper -->
    </nav>
    <!-- Navbar -->
</template>

<script>
export default {
    props: {
        isAuthenticated: {
            type: Boolean,
            required: true,
        }
    },

    data() {
        return {
            activeNav: 'trangchu' // Mặc định chọn "Trang chủ"
        };
    },

    emits: ["change:nav_value", "logout:success"],

    methods: {
        changeNav_value(name) {
            this.activeNav = name;
            this.$emit("change:nav_value", name);
        },

        logout() {
            this.activeNav = 'trangchu';
            this.$emit('change:nav_value', 'trangchu');
            this.$emit('logout:success'); // Thông báo trạng thái đăng nhập thay đổi
        }
    },

    created() {
        this.changeNav_value('trangchu');
    }
}
</script>

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