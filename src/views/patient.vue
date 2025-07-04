<template>
    <!-- navigation -->
    <Navbar
        @change:nav_value="changeNav_value"
        :isAuthenticated="isAuthenticated"
        @logout:success="logout"
    />

    <MainSite style="margin-top: 20px;"
        :nav_value="nav_value"
        :patient="patient"
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
            role: ""
        }
    },

    watch: {},

    computed: {},

    methods: {
        changeNav_value(name) {
            this.nav_value = name;
        },

        async getUser(){
            this.patient = await patientService.get(sessionStorage.getItem("userId"));
            if (!this.patient) {
                this.$router.replace({ name: "loginform" });
            }
            this.nav_value = 'trangchu';
            this.isAuthenticated = true
            this.role = this.$route.name === "patient" ? "patient" : "doctor";
        },

        logout(){
            this.patient = {}
            this.authStore.logout();
            this.isAuthenticated = false
            this.router.replace({ name: "patient" });
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