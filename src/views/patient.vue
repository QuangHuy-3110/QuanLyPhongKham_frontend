<template>
    <!-- navigation -->
    <Navbar />

    <div class="modal fade" id="staticBackdropmk" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabelmk" aria-hidden="true">
        <div class="modal-dialog">
        </div>
    </div>

    <MainSite />

    <FooterSite />

</template>

<script>
import Navbar from './patient/nav.vue';
import MainSite from './patient/main.vue';
import FooterSite from './patient/footer.vue';

export default {
    components: {
        Navbar,
        MainSite,
        FooterSite
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
        
    }
}

</script>

<style scoped>
@import "@/assets/footer.css";
    .page {
        text-align: left;
        max-width: 750px;
    }
</style>
    
