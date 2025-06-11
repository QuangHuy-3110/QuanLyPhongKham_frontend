<template>
    <main>
        <Book_form v-if="nav_value === 'lichkham' "/>
        <Examination v-if="nav_value === 'hsbenhan' "/>
        
        
    </main>
</template>

<script>
    import Book_form from '../../components/patient/book_form.vue';
    import Examination from '../../components/doctor/examination.vue'
    export default{
        props : {
            nav_value: { type: String, default: "" }
        },

        components: {
            Book_form,
            Examination,
        },

        data (){
            return {

            }
        },

        watch: {

        },

        methods: {
        }

    }
</script>

<style scoped>

</style>