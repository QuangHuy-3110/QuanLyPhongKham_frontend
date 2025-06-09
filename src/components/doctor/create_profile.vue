<template>
    <div class="modal-header">
        <h5 class="modal-title">Tiêu đề</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close_tab"></button>
    </div>

    <Profile_patient v-if="status !== 'examination'"
    @examination:patient = "examination"/>

    <Examination v-if="status === 'examination'"/>
    
</template>

<script>
    import Profile_patient from '../doctor/profile_patient.vue';
    import Examination from './examination.vue';

    export default {

        emits : ['close:patient'],

        data (){
            return {
                status: ''
            }
        },

        components : {
            Profile_patient,
            Examination
        },

        methods: {
            close_tab (){
                this.$emit('close:patient')
            },

            examination (status){
                this.status = status
            }
        }
        
    }
</script>