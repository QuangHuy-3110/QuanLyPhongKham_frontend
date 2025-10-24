<template>

    <Navbar

        @change:nav_value="changeNav_value"

        :isAuthenticated="isAuthenticated"

        @logout:success="logout"

        :patient="patient"

    />



    <MainSite style="margin-top: 20px;"

        :nav_value="nav_value"

        :patient="patient"

        @update:patient1="get_patient"

    />



    <FooterSite style="margin-top: 50px;"/>

</template>



<script>

import Navbar from './patient/nav.vue';

import MainSite from './patient/main.vue';

import FooterSite from './patient/footer.vue';

import patientService from '../services/patient.service';

import { useAuthStore } from "@/stores/authStore";

import { useRouter } from "vue-router";
import { ref } from 'vue';



export default {

    components: {

        Navbar,

        MainSite,

        FooterSite,

    },



    data() {

        return {

            patient: {},

            router: useRouter(),

            authStore: useAuthStore(),

            nav_value: 'trangchu',

            isAuthenticated: false,

            role: "",

            userInfo: {

                tenDangNhap: '',

                fullName: '',

            },

            ws: null,  // ⚠️ MỚI: WebSocket để sync login status

        }

    },



    methods: {

        get_patient(patient) {

            this.patient = patient;

        },

       

        changeNav_value(name) {

            this.nav_value = name;

        },



        async getUser(){

           try {

                const user = this.authStore.user;

                if (!user || !user.id) {

                    this.errorMessage = 'Không tìm thấy thông tin người dùng';

                    return;

                }



                if (user.role === 'patient') {

                    this.role = 'patient';

                    const patient = await patientService.get(user.id);

                    this.patient = patient;

                    this.isAuthenticated = true;

                   

                    if (patient && patient.length > 0) {

                        this.userInfo = {

                            tenDangNhap: patient.tenBN || user.id,

                            fullName: patient.hotenBN || 'Không xác định',

                        };

                    } else {

                        this.errorMessage = 'Không tìm thấy thông tin bệnh nhân';

                    }

                } else if (user.role === 'doctor' || user.role === 'admin') {

                    const doctor = await doctorService.get(user.id);

                    if (doctor) {

                        this.userInfo = {

                            tenDangNhap: doctor.tenDangNhap || user.id,

                            fullName: doctor.tenBS || 'Không xác định',

                        };

                    } else {

                        this.errorMessage = 'Không tìm thấy thông tin bác sĩ';

                    }

                } else {

                    this.errorMessage = 'Vai trò người dùng không hợp lệ';

                }



                // ⚠️ MỚI: Sync login status với WebSocket sau khi load user

                this.syncLoginStatus();

            } catch (error) {

                console.error('Lỗi khi tải thông tin người dùng:', error);

                this.errorMessage = 'Không thể tải thông tin người dùng';

            }

        },



        // ⚠️ MỚI: Sync login status qua WebSocket

        syncLoginStatus() {

            // Chỉ sync nếu đã authenticated và có patient/user ID

            if (this.isAuthenticated && this.authStore.user) {

                const userId = this.authStore.user.maBN || this.authStore.user.id;

                if (!userId) return;



                // Connect WebSocket nếu chưa có

                if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {

                    this.ws = new WebSocket('ws://localhost:3000');

                    this.ws.onopen = () => {

                        console.log('✅ Patient component connected to WebSocket');

                        // Gửi update_login_status sau khi connect

                        this.ws.send(JSON.stringify({

                            type: 'update_login_status',

                            userId: userId,

                            token: this.authStore.token

                        }));

                    };

                } else {

                    // Nếu đã connect, gửi ngay

                    this.ws.send(JSON.stringify({

                        type: 'update_login_status',

                        userId: userId,

                        token: this.authStore.token

                    }));

                }

            }

        },



        logout(){

            // ⚠️ MỚI: Gửi update logout status trước khi clear

            if (this.ws && this.ws.readyState === WebSocket.OPEN && this.authStore.user) {

                const userId = this.authStore.user.maBN || this.authStore.user.id;

                this.ws.send(JSON.stringify({

                    type: 'update_login_status',

                    userId: userId,

                    token: null  // null token = logged out

                }));

            }



            this.patient = {};

            this.isAuthenticated = false;

            this.authStore.clearUser();

           

            // Close WebSocket

            if (this.ws) {

                this.ws.close();

                this.ws = null;

            }

           

            this.$router.push({ name: 'loginform' });

        },



    },



    mounted() {

        this.getUser();

    },



    beforeUnmount() {

        // Cleanup WebSocket khi component unmount

        if (this.ws) {

            this.ws.close();

            this.ws = null;

        }

    }

}

</script>