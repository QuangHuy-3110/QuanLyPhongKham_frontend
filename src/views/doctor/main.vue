<template>
    <main class="container bg-light">
      <Home v-if="nav_value === 'trangchu'" />
        {{ console.log(working_time) }}
      <Calendar v-if="nav_value === 'lichkham'" 
        :array="{ list: working_time }"
        :columns="working_timeColumns"
        />

      <Moth_calendar v-if="nav_value === 'lichkham'" 
        :array="{ list: working_time }"
        :columns="working_timeColumns"/>
  
      <Filter
        v-if="nav_value === 'benhnhan' && show !== 'add_patient'"
        @add:patient="add_patient"
      />
  
      <Create_profile
        v-if="show === 'add_patient'"
        @close:patient="close_patient"
      />
  
      <TableForm
        v-if="nav_value === 'benhnhan' && show !== 'add_patient'"
        :array="{ list: list_patient }"
        :columns="patientColumns"
      />
  
      <TableForm v-if="nav_value === 'lichhen'" 
        :array="{ list: list_appointment }"
        :columns="appointmentColumns"
      />
    </main>
  </template>
  
  <script>
  import Calendar from '../../components/element/calendar.vue';
  import Filter from '../../components/element/filter.vue';
  import TableForm from '../../components/element/table.vue';
  import Home from '../../components/doctor/home.vue';
  import Create_profile from '../../components/doctor/create_profile.vue';
  import Moth_calendar from '../../components/element/moth_calendar.vue';

  import AppointmentService from '@/services/appointment.service'
  import PatientService from '@/services/patient.service';
  import WorkingTime from '@/services/working_time.service'
  
  export default {
    props: {
      nav_value: { type: String, default: '' },
    },
    components: {
      Home,
      Calendar,
      Filter,
      TableForm,
      Create_profile,
      Moth_calendar,
    },
    data() {
      return {
        show: '',
        list_patient: [],
        patientColumns: [
          { key: 'cccdBN', header: 'CCCD' },
          { key: 'hotenBN', header: 'Tên bệnh nhân' },
          { key: 'ngaysinhBN', header: 'Ngày sinh' },
          { key: 'sdtBN', header: 'Số điện thoại' },
          { key: 'diachiBN', header: 'Địa chỉ' },
        ],

        list_appointment: [],
        appointmentColumns: [
          { key: 'maBN', header: 'Mã bệnh nhân' },
          { key: 'hotenBN', header: 'Họ tên bệnh nhân' },
          { key: 'ngaythangnam', header: 'Ngày đặt lịch' },
          { key: 'khunggio', header: 'Khung giờ hẹn' },
          { key: 'mota', header: 'Mô tả' },
          
        ],

        working_time: [],
        columns: [
            // { key: 'maBS', header: 'Bác sĩ' },
            { key: 'ngaythangnam', header: 'Ngày' },
            { key: 'giobatdau', header: 'Giờ bắt đầu' },
            { key: 'gioketthuc', header: 'Giờ kết thúc' }
        ]
      };
    },
    watch: {
      nav_value: {
        handler() {
          this.show = '';
        },
      },
    },
    methods: {
        async get_working_time() {
            try {
            this.working_time = await WorkingTime.getAll();
            } catch (error) {
            console.log('Lỗi khi lấy lịch làm việc!', error);
            }
        },
        
        async get_listPatient() {
            try {
            this.list_patient = await PatientService.getAll();
            } catch (error) {
            console.log('Lỗi khi lấy danh sách bệnh nhân!', error);
            }
        },

        async get_list_appointment() {
            try {
                this.list_appointment = await AppointmentService.getAll();
                // Duyệt qua danh sách lịch hẹn và thêm tên bệnh nhân
                this.list_appointment = this.list_appointment.map(appointment => {
                    // Tìm bệnh nhân tương ứng trong list_patient dựa trên maBN
                    const patient = this.list_patient.find(p => p.maBN === appointment.maBN);
                    // Thêm thuộc tính hotenBN vào appointment
                    return {
                        ...appointment,
                        hotenBN: patient ? patient.hotenBN : 'Không tìm thấy tên bệnh nhân'
                    };
                });
            } catch (error) {
                console.log('Lỗi khi lấy danh sách lịch hẹn!', error);
            }
        },

        add_patient(status) {
            this.show = status;
        },
        close_patient() {
            this.show = '';
        },
    },
    mounted() {
        this.get_working_time()
        this.get_listPatient();
        this.get_list_appointment()
    },
  };
  </script>