<template>
    <div style="margin: 5px 5px;">
        <BannerSite/>

        <hr>

        <Navbar/>

        <div class="modal fade" id="staticBackdropmk" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabelmk" aria-hidden="true">
            <div class="modal-dialog">

            </div>
        </div>

        <div class="container-fluid bg-light-subtle">
            <div class="row flex-nowrap">
                
                <!-- <MainSite/> -->

            </div>
        </div>
    </div>
</template>
<script>
import BannerSite from './admin/banner.vue';
import Navbar from './admin/nav.vue';
import MainSite from './admin/main.vue';

export default {
    components: {
        BannerSite,
        Navbar,
        MainSite
    },

    data() {
        return {
           
        };
    },

    watch: {
        
    },


    computed: {

    },


    methods: {
        
    },

    mounted() {
       
    },

    created() {
        
    },

    beforeDestroy() {

    },
};

</script>
    <style scoped>
        .page {
            text-align: left;
            max-width: 750px;
    }
</style>