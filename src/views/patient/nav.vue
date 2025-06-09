<template>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-secondary-subtle fixed-top">
        <!-- Container wrapper -->
        <div class="container">
            <!-- Navbar brand -->
            <a href="#" class="d-flex align-items-center p-3"
                style=" max-width: 250px; margin-right: 200px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/224/224595.png" width="60" class="me-2">
                <p class="mb-0 fw-bold fs-2 text-muted"
                    style="font-family: 'Poppins', sans-serif; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">
                    Library
                </p>
            </a>


            <!-- Search form -->
            <SearchBar_user />

            <!-- Toggle button -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>


            <!-- Collapsible wrapper -->
            <div class="collapse navbar-collapse " id="navbarSupportedContent">
                <!-- Left links -->
                <ul class="navbar-nav d-flex justify-content-evenly w-100 mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link d-flex flex-column align-items-center text-center active" aria-current="page"
                            href="#">
                            <i class="fa-solid fa-home my-2 fs-5"></i>
                            <span class="small">Trang chủ</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-flex flex-column align-items-center text-center active" aria-current="page"
                            href="#">
                            <i class="fa-solid fa-paper-plane my-2 fs-5"></i>
                            <span class="small">Yêu cầu</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-flex flex-column align-items-center text-center active" aria-current="page"
                            href="#">
                            <i class="fa-solid fa-book my-2 fs-5"></i>
                            <span class="small">Đang mượn</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-flex flex-column align-items-center text-center active" aria-current="page"
                            href="#">
                            <i class="fa-solid fa-clock my-2 fs-5"></i>
                            <span class="small">Lịch sử</span>
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
                                    data-bs-target='#profileModal'>Hồ sơ</a></li>
                            <li><a class="dropdown-item" href="#" data-bs-toggle="modal"
                                    data-bs-target="#staticBackdropmk">Đổi mật khẩu</a></li>
                            <li><a class="dropdown-item" href="#" >Đăng xuất</a></li>
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

<style scoped>
    .page {
        text-align: left;
        max-width: 750px;
    }
</style>