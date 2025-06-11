<template>
    <!-- navigation -->
    <Navbar 
    @change:nav_value="changeNav_value"
    v-if="nav_value !== 'dangki' && nav_value !== 'dangnhap'"
    />

    <!-- <div class="modal fade" id="staticBackdropmk" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabelmk" aria-hidden="true">
        <div class="modal-dialog">
        </div>
    </div> -->

    <MainSite style="margin-top: 20px;"
        :nav_value="nav_value"
        v-if="nav_value !== 'dangki' && nav_value !== 'dangnhap'"
    />

    <FooterSite style="margin-top: 50px;"
    v-if="nav_value !== 'dangki' && nav_value !== 'dangnhap'"/>
    <Register v-if="nav_value === 'dangki'"/>

</template>

<script>
import Navbar from './patient/nav.vue';
import MainSite from './patient/main.vue';
import FooterSite from './patient/footer.vue';
import Register from '../views/register.vue';
export default {
    components: {
        Navbar,
        MainSite,
        FooterSite,
        Register,
    },

    data() {
        return {
            nav_value: ''
        }
    },

    watch: {

    },

    computed: {

    },

    methods: {
        changeNav_value (name){
            this.nav_value = name
        }

    }
}

</script>

<style scoped>
/* .page {
    text-align: left;
    max-width: 750px;
} */
</style>
