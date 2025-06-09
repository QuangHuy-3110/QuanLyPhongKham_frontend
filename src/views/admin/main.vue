<template>
    <div class="col-2 px-2 bg-dark-subtle ">
        <div id="sidebar" class="collapse collapse-horizontal show border-end bg-secondary-subtle ">
            <div id="sidebar-nav" class="list-group border-0 rounded-0 text-sm-start min-vh-100 ">

                <div class="accordion" id="accordionExample">

                    <div class="accordion-item">

                        <h2 class="accordion-header">
                            <button class="accordion-button list-group-item" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Quản lý nhân viên
                            </button>
                        </h2>

                        <div id="collapseOne" class="accordion-collapse collapse show bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white">
                                    <span>Thêm nhân viên</span> 
                                </a>

                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white">
                                    <span>Xem nhân viên</span> 
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false"
                                aria-controls="collapseTwo">
                                Quản lý sách
                            </button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white">
                                    <span>Thêm sách</span> 
                                </a>

                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white">
                                    <span>Xem tất cả các sách</span> 
                                </a>

                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">

                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false"
                                aria-controls="collapseThree">
                                Quản lý đọc giả
                            </button>
                        </h2>

                        <div id="collapseThree" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white">
                                    <span>Thêm đọc giả</span> 
                                </a>

                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white">
                                    <span>Xem thông tin đọc giả</span> 
                                </a>

                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">

                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false"
                                aria-controls="collapseFour">
                                Quản lý nhà xuất bản
                            </button>
                        </h2>

                        <div id="collapseFour" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white">
                                    <span>Thêm nhà xuất bản</span> 
                                </a>

                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white">
                                    <span>Xem tất cả nhà xuất bản</span> 
                                </a>
                            </div>
                        </div>

                    </div>

                    <div class="accordion-item">

                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed list-group-item" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false"
                                aria-controls="collapseFive">
                                Giải quyết mượn trả
                            </button>
                        </h2>

                        <div id="collapseFive" class="accordion-collapse collapse bg-dark-subtle"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white">
                                    <span>Xử lý yêu cầu mượn sách</span>
                                </a>

                                <a href="#" class="list-group-item rounded-3 mt-2 bg-white">
                                    <span>Xem thông tin mượn sách</span>
                                </a>

                                <a href="#" class="list-group-item rounded-3 mt-2  bg-white">
                                    <span>Xem tất cả các sách đã trả</span> 
                                </a>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <a href="#"
                    class="list-group-item border-end-0 rounded-3 mt-2 d-inline-block text-truncate bg-success text-white p-3"
                    ><span>Làm mới</span> </a>
            </div>
        </div>
    </div>
</template>