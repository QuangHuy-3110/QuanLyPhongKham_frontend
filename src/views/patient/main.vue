<template>
    <main class="container bg-light">
        <Home v-if="nav_value === 'trangchu'" />

        <Book_form v-if="nav_value === 'lichkham' "
        :patient = "patient"
        @appointmentBooked="get_list_appointment"/>

        <Examination v-if="nav_value === 'hsbenhan' "
        :patient = "patient"
        @update:patient="this.$emit('update:patient1', $event)"
        />
        
        <TableForm v-if="nav_value === 'lichhen'" 
        :array="{ list: list_appointment }"
        :columns="appointmentColumns"
        :columns_full="appointmentColumns"
        :patient="patient"
        :name="'lichhen'"
        :role="'patient'"
        v-model:activeIndex="activeIndex"
        data-bs-toggle="modal" data-bs-target="#exampleModal"
      />

    </main>
</template>

<script>
    import Home from '../../components/patient/home.vue';
    import Book_form from '../../components/patient/book_form.vue';
    import Examination from '../../components/doctor/examination.vue';
    import TableForm from '../../components/element/table.vue';
    import appointmentService from '../../services/appointment.service';
    import WebSocketService from '../../services/ws.service';

    export default{
        props : {
            nav_value: { type: String, default: "" },
            patient: { type:Object, required: true}
        },
        emits: ['update:patient1'],
        components: {
            Book_form,
            Examination,
            TableForm,
            Home
        },

        data (){
            return {
                activeIndex: -1,
                wsService: new WebSocketService(),
                list_appointment: [],
                appointmentColumns: [
                    { key: 'maBN', header: 'Mã bệnh nhân' },
                    { key: 'maBS', header: 'Mã bác sĩ' },
                    { key: 'ngaythangnam', header: 'Ngày đặt lịch' },
                    { key: 'khunggio', header: 'Khung giờ hẹn' },
                    { key: 'mota', header: 'Mô tả' },  
                ],
            }
        },

        watch: {
          list_appointment: {
            handler(newList){
            },
            immediate: true, // Chạy ngay lập tức nếu doctor đã có sẵn
            deep: true,
          },

          patient: {
            handler(newpatient) {
              if (newpatient && newpatient.maBN) {
                this.wsService.connect();
                this.wsService.ws.onopen = () => {
                  this.wsService.send({ type: 'init_patient', patientId: newpatient.maBN });
                  this.get_list_appointment();
                };
              }
            },
            immediate: true, // Chạy ngay lập tức nếu doctor đã có sẵn
            deep: true, // Theo dõi các thay đổi trong thuộc tính lồng nhau của doctor
          },
        },

        methods: {
            async get_list_appointment() {
                try {
                    this.list_appointment = await appointmentService.get_patient(this.patient.maBN);
                } catch (error) {
                    console.log('Lỗi khi lấy danh sách lịch hẹn!', error);
                }
            },
        },

        mounted(){
          // this.wsService.connect();
          this.wsService.onMessage((message) => {
            if (message.type === 'appointment_cancelled') {
              this.get_list_appointment();
            }
          });           
        }

    }
</script>

<style scoped>

</style>