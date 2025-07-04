<template>
    <main class="container bg-light">
        <Home v-if="nav_value === 'trangchu'" />

        <Book_form v-if="nav_value === 'lichkham' "
        :patient = "patient"/>

        <Examination v-if="nav_value === 'hsbenhan' "
        :patient = "patient"/>
        
        <TableForm v-if="nav_value === 'lichhen'" 
        :array="{ list: list_appointment }"
        :columns="appointmentColumns"
        :patient="patient"
        v-model:activeIndex="activeIndex"
        data-bs-toggle="modal" data-bs-target="#exampleModal"
      />

    <div v-if="activeIndex !== -1 && nav_value === 'lichhen'">
      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Chi tiết lịch hẹn</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p><b>Họ và tên bệnh nhân:</b> {{ patient.hotenBN }}</p>
              <p><b>Ngày hẹn:</b> {{ list_appointment[activeIndex].ngaythangnam }}</p>
              <p><b>Khung giờ:</b> {{ list_appointment[activeIndex].khunggio }}</p>
              <p><b>Trạng thái:</b> {{ list_appointment[activeIndex].trangthai }}</p>
              <p><b>Mô tả bệnh:</b> {{ list_appointment[activeIndex].mota }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    </main>
</template>

<script>
    import Home from '../../components/patient/home.vue';
    import Book_form from '../../components/patient/book_form.vue';
    import Examination from '../../components/doctor/examination.vue';
    import TableForm from '../../components/element/table.vue';
    import appointmentService from '../../services/appointment.service';

    export default{
        props : {
            nav_value: { type: String, default: "" },
            patient: { type:Object, required: true}
        },

        components: {
            Book_form,
            Examination,
            TableForm,
            Home
        },

        data (){
            return {
                activeIndex: -1,

                list_appointment: [],
                appointmentColumns: [
                    { key: 'maBN', header: 'Mã bệnh nhân' },
                    { key: 'hotenBN', header: 'Họ tên bệnh nhân' },
                    { key: 'ngaythangnam', header: 'Ngày đặt lịch' },
                    { key: 'khunggio', header: 'Khung giờ hẹn' },
                    { key: 'mota', header: 'Mô tả' },  
                ],
            }
        },

        watch: {

        },

        methods: {

            async get_list_appointment() {
                try {
                    this.list_appointment = await appointmentService.get_patient(this.patient.maBN);
                    console.log(this.list_appointment)
                } catch (error) {
                    console.log('Lỗi khi lấy danh sách lịch hẹn!', error);
                }
            },
        },

        mounted(){
            
            this.get_list_appointment()            
        }

    }
</script>

<style scoped>

</style>