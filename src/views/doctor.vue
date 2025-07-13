<template>
    <!-- navigation -->
    <Navbar 
        @change:nav_value="changeNav_value"
        @logout:logout="logout"
        :doctor="doctor"
    />

    <MainSite style="margin-top: 20px;"
        :nav_value="nav_value"
        :doctor="doctor"
    />

    <FooterSite style="margin-top: 50px;"/>

</template>

<script>
import Navbar from './doctor/nav.vue';
import MainSite from './doctor/main.vue';
import FooterSite from './doctor/footer.vue';

import doctorService from '../services/doctor.service';
import { useAuthStore } from "@/stores/authStore";
export default {
    components: {
        Navbar,
        MainSite,
        FooterSite,
    },

    data() {
        return {
            nav_value: '',
            doctor: null,
            userInfo: {
                tenDangNhap: '',
                fullName: '',
            },
            authStore: useAuthStore(),
        }
    },

    watch: {

    },

    computed: {

    },

    methods: {
        changeNav_value (name){
            this.nav_value = name
        },

        async getUser(){
           try {
                const user = this.authStore.user;
                if (!user || !user.id) {
                    this.errorMessage = 'Không tìm thấy thông tin người dùng';
                    return;
                }

                if (user.role === 'benhnhan') {
                    const patient = await patientService.get_acname(user.id);
                    this.patient = patient;
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
                    this.doctor = doctor;
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
            this.doctor = {}
            this.authStore.clearUser();
            this.$router.push({ name: 'patient' });
        },
    },

    async created() {
        await this.getUser();
    },
}

</script>

<style scoped>
/* .page {
    text-align: left;
    max-width: 750px;
} */
</style>
