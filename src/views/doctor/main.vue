<template>
  <main class="container bg-light">
    <Home v-if="nav_value === 'trangchu'" />

    <Calendar
      v-if="nav_value === 'lichkham'"
      :array="{ list: working_time }"
      :columns="working_timeColumns"
    />

    <Moth_calendar
      v-if="nav_value === 'lichkham'"
      :array="{ list: working_time }"
      :columns="working_timeColumns"
    />

    <Filter
      v-if="nav_value === 'benhnhan' && show !== 'add_patient' && activeIndex === -1"
      @add:patient="add_patient"
      @filter:patient="filterPatients"
      @refresh:patient="refreshPatients"
    />

    <Create_profile
      v-if="show === 'add_patient'"
      @close:patient="close_patient"
      :doctor="doctor"
    />

    <TableForm
      v-if="nav_value === 'benhnhan' && show !== 'add_patient' && activeIndex === -1"
      :array="{ list: list_patient }"
      :columns="patientColumns" 
      v-model:activeIndex="activeIndex"
    />

    <Examination
      v-if="activeIndex !== -1 && nav_value === 'benhnhan'"
      @close:examination="close_examination"
      :patient="list_patient[activeIndex]"
      :doctor="doctor"
      :role="role"
      @update:patient="get_listPatient"
    />

    <TableForm
      v-if="nav_value === 'lichhen' && check === ''"
      :array="{ list: list_appointment }"
      :columns="appointmentColumns"
      :columns_full="appointmentColumns"
      :name="'lichhen'"
      :role="role"
      :doctor="doctor"
      @check-profile="check_profile"
      v-model:activeIndex="activeIndex"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
      @update:appointment="get_list_appointment"
    />

    <Examination
      v-if="check === 'see' && nav_value === 'lichhen'"
      @close:examination="close_examination"
      :patient="patient"
      :doctor="doctor"
      :role="role_fake"
      @update:patient="get_listPatient"
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
import Examination from '../../components/doctor/examination.vue';
import AppointmentService from '@/services/appointment.service';
import PatientService from '@/services/patient.service';
import WorkingTime from '@/services/working_time.service';

import WebSocketService from '@/services/ws.service';

export default {
  props: {
    nav_value: { type: String, default: 'trangchu' },
    doctor: { type: Object, required: true },
  },
  components: {
    Home,
    Calendar,
    Filter,
    TableForm,
    Create_profile,
    Moth_calendar,
    Examination,
  },
  data() {
    return {
      wsService: new WebSocketService(), // Khởi tạo WebSocketService
      role_fake: 'doctor',
      wsMessages: [],
      show: '',
      activeIndex: -1,
      role: 'doctor',
      patient: {},
      patient_new: {},
      check: '',
      list_patient: [],
      original_list_patient: [], // Lưu danh sách bệnh nhân gốc
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
        { key: 'trangthai', header: 'Trạng thái' },
      ],
      working_time: [],
      working_timeColumns: [
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
        this.activeIndex = -1;
      },
    },

    list_appointment: {
      handler(newList){
      },
      immediate: true, // Chạy ngay lập tức nếu doctor đã có sẵn
      deep: true,
    },

    doctor: {
      handler(newDoctor) {
        if (newDoctor && newDoctor.maBS) {
          this.get_listPatient();
          this.wsService.connect();
          this.wsService.ws.onopen = () => {
            this.wsService.send({ type: 'init', doctorId: newDoctor.maBS });
            this.get_working_time();
            this.get_list_appointment();
          };
        }
      },
      immediate: true, // Chạy ngay lập tức nếu doctor đã có sẵn
      deep: true, // Theo dõi các thay đổi trong thuộc tính lồng nhau của doctor
    },
  },

  methods: {

    check_profile(maBN, role) {
      this.check = 'see';
      this.role_fake = role;
      this.patient = this.list_patient.find(item => item.maBN === maBN);
      console.log('Checking profile for patient:', this.patient);
    },

    async get_working_time() {
      try {
        this.working_time = await WorkingTime.get_doctor(this.doctor.maBS);
        console.log("bacs six:", this.doctor)
      } catch (error) {
        console.log('Lỗi khi lấy lịch làm việc!', error);
      }
    },

    async get_listPatient() {
      try {
        this.list_patient = await PatientService.getAll();
        this.original_list_patient = [...this.list_patient]; // Lưu danh sách gốc
      } catch (error) {
        console.log('Lỗi khi lấy danh sách bệnh nhân!', error);
      }
    },

    async get_list_appointment() {
      try {
        this.list_appointment = await AppointmentService.get_doctor(this.doctor.maBS);
        this.list_appointment = this.list_appointment.map(appointment => {
          const patient = this.list_patient.find(p => p.maBN === appointment.maBN);
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

    async close_patient() {
      await this.get_listPatient();
      this.show = '';
      this.activeIndex = -1;
    },

    close_examination() {
      this.check = '';
      this.show = '';
      this.activeIndex = -1;
    },

    filterPatients(filter) {
      this.list_patient = this.original_list_patient.filter(patient => {
        const hotenMatch = filter.hotenBN
          ? patient.hotenBN.toLowerCase().includes(filter.hotenBN.toLowerCase())
          : true;
        const cccdMatch = filter.cccdBN
          ? patient.cccdBN.toLowerCase().includes(filter.cccdBN.toLowerCase())
          : true;
        const diachiMatch = filter.diachiBN
          ? patient.diachiBN.toLowerCase().includes(filter.diachiBN.toLowerCase())
          : true;
        return hotenMatch && cccdMatch && diachiMatch;
      });
    },

    refreshPatients() {
      this.list_patient = [...this.original_list_patient]; // Khôi phục danh sách gốc
    }
  },

  mounted() {
    this.get_listPatient();
    // Xử lý tin nhắn từ WebSocket
    // this.wsService.connect();
    this.wsService.onMessage((message) => {
      if (message.type === 'appointment_update') {
        this.get_list_appointment();
      }else if (message.type === 'appointment_cancelled') {
        this.get_list_appointment();
      }else if (message.type === 'patient_update') {
        this.get_listPatient();
      }
      
    });
  },

  beforeDestroy() {
    this.wsService.disconnect(); // Đóng WebSocket khi component bị hủy
  },
};
</script>