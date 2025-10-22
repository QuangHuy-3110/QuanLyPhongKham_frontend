<template>
    <!-- navigation -->
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
export default {
    components: {
        Navbar,
        MainSite,
        FooterSite,
    },

    data() {
        return {
            patient: null,
            router: useRouter(),
            authStore: useAuthStore(),
            nav_value: 'trangchu',
            isAuthenticated: false, // Biến kiểm tra trạng thái đăng nhập
            role: "",
            userInfo: {
                tenDangNhap: '',
                fullName: '',
            },
        }
    },

    watch: {},

    computed: {},

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
                    this.isAuthenticated = true; // Đặt trạng thái đăng nhập là true
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
                    console.log('Doctor data:', doctor); // Debug
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
            } catch (error) {
                console.error('Lỗi khi tải thông tin người dùng:', error);
                this.errorMessage = 'Không thể tải thông tin người dùng';
            }
        },

        logout(){
            this.patient = {}
            this.authStore.clearUser();
            this.$router.push({ name: 'loginform' });
        },

    },

    mounted() {
        this.getUser() 
    }
}
</script>

<style scoped>
/* .page {
    text-align: left;
    max-width: 750px;
} */
</style>