<template>
    <!-- navigation -->
    <Navbar 
        @change:nav_value="changeNav_value"
    />

    <MainSite style="margin-top: 20px;"
        :nav_value="nav_value"
    />

    <FooterSite style="margin-top: 50px;"/>

</template>

<script>
import Navbar from './doctor/nav.vue';
import MainSite from './doctor/main.vue';
import FooterSite from './doctor/footer.vue';

export default {
    components: {
        Navbar,
        MainSite,
        FooterSite,
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
