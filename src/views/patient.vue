<template>
    <!-- navigation -->
    <Navbar/>

    <!-- <div class="modal fade" id="staticBackdropmk" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabelmk" aria-hidden="true">
        <div class="modal-dialog">
        </div>
    </div> -->

    <MainSite style="margin-top: 20px;"/>

    <FooterSite style="margin-top: 50px;"/>

</template>

<script>
import Navbar from './patient/nav.vue';
import MainSite from './patient/main.vue';
import FooterSite from './patient/footer.vue';
export default {
    components: {
        Navbar,
        MainSite,
        FooterSite,
    },

    data() {
        return {
            
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
