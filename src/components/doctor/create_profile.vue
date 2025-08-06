<template>
    <div class="modal-header" v-if="status !== 'examination'">
        <h5 class="modal-title">Thêm bệnh nhân</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close_tab"></button>
    </div>

    <Profile_patient v-if="status !== 'examination'"
    @examination:patient = "examination"
    @push:patient = "get_patient"
    :doctor="doctor"
    />

    <Examination v-if="status === 'examination'"
    @close:examination = "close_examination"
    :patient = "patient[0]"
    :doctor="doctor"/>
    
</template>

<script>
    import Profile_patient from '../doctor/profile_patient.vue';
    import patientService from '../../services/patient.service';
    import Examination from './examination.vue';

    export default {

        emits : ['close:patient'],
        props: {
            doctor: {
                type: Object,
                required: true
            }
        },
        data (){
            return {
                status: '',
                patient: {},
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

            close_examination() {
                this.$emit('close:patient')
            },

            examination (status){
                this.status = status
            },

            async get_patient(patient){
                try{
                    this.patient = await patientService.get_cccd(patient.cccdBN)
                    console.log(this.patient)
                }catch (error){
                    console.log("Lỗi ở create profile khi lấy mã bệnh nhân:", error)
                }
                
            }
        }
        
    }
</script>