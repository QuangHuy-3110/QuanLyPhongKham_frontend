<template>
    <div style="padding: 10px 50px; display: flex;" class="bg-secondary text-white p-3">
        <img src="https://cdn-icons-png.flaticon.com/512/224/224595.png" width="100">
        <div class="page-header pt-3 " style="padding-left: 50px;">
            <h3>Hệ thống quản lý thư viện</h3>
            <p class="lead">Dành cho</p>
        </div>
        <div class=" ms-auto mb-2 mb-lg-0">
            <ul>
                <li class="dropdown">
                    <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdownMenuLink"
                        role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <!-- src="https://media.istockphoto.com/id/954281130/vi/vec-to/man-user-icon-vector-person-symbol-profile-stroke-circle-avatar-sign-in-flat-color-glyph.jpg?s=612x612&w=0&k=20&c=-r_rPQUh901XdfNhCe3A67pPp5MlUH0jdyCCWs0goaU=" -->
                        <img
                            src="https://cdn3.iconfinder.com/data/icons/avatars-collection/256/24-128.png"
                            class="rounded-circle" height="50" alt="" loading="lazy" />

                        <img 
                            src="https://cdn3.iconfinder.com/data/icons/avatars-collection/256/20-128.png"
                            class="rounded-circle" height="50" alt="" loading="lazy" />
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <li><a class="dropdown-item btn btn-primary" data-bs-toggle="modal"
                                data-bs-target="#profileModal">Hồ sơ</a></li>
                        <li><a class="dropdown-item" href="#" data-bs-toggle="modal"
                                data-bs-target="#staticBackdropmk">Đổi mật khẩu</a></li>
                        <li><a class="dropdown-item" href="#" >Đăng xuất</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>