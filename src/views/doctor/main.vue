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
    />

    <TableForm
      v-if="nav_value === 'lichhen' && check === ''"
      :array="{ list: list_appointment }"
      :columns="appointmentColumns"
      v-model:activeIndex="activeIndex"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    />

    <div v-if="activeIndex !== -1 && nav_value === 'lichhen'">
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Chi tiết lịch hẹn</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p><b>Họ và tên bệnh nhân:</b> {{ list_appointment[activeIndex].hotenBN }}</p>
              <p><b>Ngày hẹn:</b> {{ list_appointment[activeIndex].ngaythangnam }}</p>
              <p><b>Khung giờ:</b> {{ list_appointment[activeIndex].khunggio }}</p>
              <p><b>Trạng thái:</b> {{ list_appointment[activeIndex].trangthai }}</p>
              <p><b>Mô tả bệnh:</b> {{ list_appointment[activeIndex].mota }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
              <button type="button" class="btn btn-primary" @click="check_profile(list_appointment[activeIndex].maBN)" data-bs-dismiss="modal">Xem hồ sơ bệnh nhân</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Examination
      v-if="check === 'see' && nav_value === 'lichhen'"
      @close:examination="close_examination"
      :patient="patient"
      :doctor="doctor"
      :role="role"
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

export default {
  props: {
    nav_value: { type: String, default: 'trangchu' },
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
      show: '',
      activeIndex: -1,
      doctor: {
        maBS: 'BS0001'
      },
      role: 'doctor',
      patient: {},
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
  },
  methods: {
    check_profile(maBN) {
      this.check = 'see';
      this.patient = this.list_patient.find(item => item.maBN === maBN);
    },

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
        this.original_list_patient = [...this.list_patient]; // Lưu danh sách gốc
      } catch (error) {
        console.log('Lỗi khi lấy danh sách bệnh nhân!', error);
      }
    },

    async get_list_appointment() {
      try {
        this.list_appointment = await AppointmentService.getAll();
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
    this.get_working_time();
    this.get_listPatient();
    this.get_list_appointment();
  },
};
</script>