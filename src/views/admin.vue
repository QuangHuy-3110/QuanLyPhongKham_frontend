<template>
    
    <div style="margin: 5px 5px;">
        <BannerSite/>

        <hr>     

        <div class="container-fluid bg-light-subtle">
            <div class="row flex-nowrap">
                <Navbar
                @change:nav_value="changeNav_value"/>

                <!-- Thêm bác sĩ -->
                <Add_doctor style="max-width: 1100px;" v-if="nav_value === 'themBS'"
                @formSubmitted="get_doctors"/>

                <!-- Xem danh sách bác sĩ -->
                <See_Table style="max-width: 1200px;" v-if="nav_value === 'xemBS'"
                :name="'Xem danh sách bác sĩ'"
                :array="{list: doctors}"
                :columns="doctorColumns"
                :columns_full="doctorColumns_full"
                @update:array="get_doctors"/>

                <!-- Xem danh sách bác sĩ đã xóa -->
                <See_Table style="max-width: 1200px;" v-if="nav_value === 'xemBS_Xoa'"
                :name="'Xem danh sách bác sĩ đã xóa'"
                :array="{list: doctors_del}"
                :columns="doctorColumns"
                :columns_full="doctorColumns_full"
                @update:array="get_doctors"/>

                <!-- Thêm lịch làm việc cho bác sĩ -->
                <Add_schedual style="max-width: 1100px;" v-if="nav_value === 'themlichBS'"
                :doctors="doctors"
                @formSubmitted="get_schedules"/>

                <!-- Xem lịch làm việc -->
                <Work_schedule style="max-width: 1100px;" v-if="nav_value === 'xemlichBS'"
                :doctors="doctor_big"
                :specialties="specialties"
                :schedules="schedules"
                />

                <!-- Xem danh sách bệnh nhân -->
                <See_Table style="max-width: 1100px;" v-if="nav_value === 'xemBN'"
                :name="'Danh sách bệnh nhân'"
                :array="{list: patients}"
                :columns="patientColumns"
                :columns_full="patientColumns_full"
                @update:array="get_patients"/>

                <!-- Xem danh sách bệnh nhân đã xóa-->
                <See_Table style="max-width: 1100px;" v-if="nav_value === 'xemBN_Xoa'"
                :name="'Danh sách bệnh nhân đã xóa'"
                :array="{list: patients_del}"
                :columns="patientColumns"
                :columns_full="patientColumns_full"
                @update:array="get_patients"/>

                <!-- Thêm thuốc -->
                <Add_Medicine style="max-width: 1100px;" v-if="nav_value === 'themThuoc'"
                @formSubmitted="get_medicines"/>

                <!-- Xem danh sách thuốc -->
                <See_Table style="max-width: 1100px;" v-if="nav_value === 'xemThuoc'"
                :name="'Danh sách thuốc'"
                :array="{list: medicines}"
                :columns="medicineColumns"
                :columns_full="medicineColumns_full"
                @update:array="get_medicines"/>

                <!-- Xem danh sách thuốc gần hết -->
                <See_Table style="max-width: 1100px;" v-if="nav_value === 'xemThuocmin'"
                :name="'Danh sách thuốc gần hết'"
                :array="{list: medicines_min}"
                :columns="medicineColumns"
                :columns_full="medicineColumns_full"
                @update:array="get_medicines"/>

                <!-- Xem danh sách thuốc đã xóa -->
                <See_Table style="max-width: 1100px;" v-if="nav_value === 'xemThuoc_Xoa'"
                :name="'Danh sách thuốc đã xóa'"
                :array="{list: medicines_del}"
                :columns="medicineColumns"
                :columns_full="medicineColumns_full"
                @update:array="get_medicines"/>

                <!-- Thêm chuyên khoa -->
                <Add_specialties style="max-width: 1100px;" v-if="nav_value === 'themCK'"
                @formSubmitted="get_specialties"/>

                <!-- Xem danh sách chuyên khoa -->
                <See_Table style="max-width: 1100px;" v-if="nav_value === 'xemCK'"
                :name="'Danh sách chuyên khoa'"
                :array="{list: specialties}"
                :columns="specialtiesColumns"
                :columns_full="specialtiesColumns_full"/>

                <!-- Xem danh sách hồ sơ bệnh án -->
                <Table_exam style="max-width: 1100px;" v-if="nav_value === 'xemBAn' && active_index === -1"
                :name="'Danh sách hồ sơ bệnh án'"
                :array="{list: records}"
                :columns="recordColumns"
                :columns_full="recordColumns_full"
                @update:activeIndex="update_activeIndex"/>

                <Infoexam style="max-width: 1100px;" v-if="active_index !== -1 && nav_value === 'xemBAn'"
                :name="'Danh sách hồ sơ bệnh án'"
                @update:activeIndex="update_activeIndex"
                :record="records[active_index]"
                :patient="patient"
                :columns_full="patientColumns_full"
                :prescriptions="prescriptions"
                @update:array="get_records"
                @update:prescriptions="get_prescriptions"/>

                <!-- Xem danh sách hồ sơ bệnh án đã xóa -->
                <Table_exam style="max-width: 1100px;" v-if="nav_value === 'xemBAn_Xoa' && active_index === -1"
                :name="'Danh sách hồ sơ bệnh án đã xóa'"
                :array="{list: records_del}"
                :columns="recordColumns"
                :columns_full="recordColumns_full"
                @update:activeIndex="update_activeIndex"/>

                <Infoexam style="max-width: 1100px;" v-if="active_index !== -1 && nav_value === 'xemBAn_Xoa'"
                :name="'Danh sách hồ sơ bệnh án đã xóa'"
                @update:activeIndex="update_activeIndex"
                :record="records_del[active_index]"
                :patient="patient"
                :columns_full="patientColumns_full"
                :prescriptions="prescriptions"
                @update:array="get_records"
                @update:prescriptions="get_prescriptions"/>

                <!-- Xử lý lịch hẹn -->
                <See_Table style="max-width: 1100px;" v-if="nav_value === 'xulyLH'"
                :name="'Danh sách lịch hẹn'"
                :array="{list: appointments_new}"
                :columns="appointmentsColumns"
                :columns_full="appointmentsColumns_full"
                @update:appointment_new="updateAppointment_new"/>

                <!-- Xem danh sách cuộc hẹn -->
                <See_Table style="max-width: 1100px;" v-if="nav_value === 'xemLH'"
                :name="'Lịch sử cuộc hẹn'"
                :array="{list: appointments}"
                :columns="appointmentsColumns"
                :columns_full="appointmentsColumns_full"
                @update:array="get_appointment"/>

            </div>
        </div>
    </div>
</template>
<script>
import BannerSite from './admin/banner.vue';
import Navbar from './admin/nav.vue';

import See_Table from '../components/admin/table.vue';
import Add_doctor from '../components/admin/add_doctor.vue';
import Add_schedual from '../components/admin/add_schedual.vue';
import Work_schedule from '../components/admin/work_schedule.vue';
import Add_Medicine from '../components/admin/add_Medicine.vue';
import Add_specialties from '../components/admin/add_specialties.vue'
import Infoexam from '../components/admin/infoexam.vue';
import Table_exam from '../components/admin/table_exam.vue';

import doctorService from '../services/doctor.service'
import working_timeService from '../services/working_time.service';
import specialtiesService from '../services/specialties.service';
import doctor_roleService from '../services/doctor_role.service';
import patientService from '../services/patient.service'
import drugService from '../services/drug.service';
import recordService from '../services/record.service'
import prescriptionService from '../services/prescription.service'
import appointmentService from '../services/appointment.service'

import WebSocketService from '@/services/ws.service';
import { useAuthStore } from "@/stores/authStore";

export default {
    components: {
        BannerSite,
        Navbar,
        Add_doctor,
        See_Table,
        Add_schedual,
        Work_schedule,
        Add_Medicine,
        Add_specialties,
        Infoexam,
        Table_exam
    },

    data() {
        return {
            wsService: new WebSocketService(), // Khởi tạo WebSocketService
            records_del: [],
            medicines_del: [],
            patients_del: [],
            doctors_del: [],
            wsMessages: [],
            nav_value: '',
            name: '',
            admin: null,
            userInfo: {
                tenDangNhap: '',
                fullName: '',
            },
            authStore: useAuthStore(),
            patient: null,
            active_index: -1,
            prescriptions: [],
            doctors: [],
            doctorColumns: [
                { key: 'maBS', header: 'Mã bác sĩ' },
                { key: 'cccdBS', header: 'CCCD' },
                { key: 'tenBS', header: 'Tên bác sĩ' },
                { key: 'ngaysinhBS', header: 'Ngày sinh' },
                { key: 'sdtBS', header: 'Số điện thoại' },
                { key: 'diachiBS', header: 'Địa chỉ' },
            ],
            doctorColumns_full: [
                { key: 'maBS', header: 'Mã bác sĩ' },
                { key: 'cccdBS', header: 'CCCD' },
                { key: 'tenBS', header: 'Tên bác sĩ' },
                { key: 'ngaysinhBS', header: 'Ngày sinh' },
                { key: 'sdtBS', header: 'Số điện thoại' },
                { key: 'emailBS', header: 'Email' },
                { key: 'soCCHN', header: 'Số chứng chỉ hành nghề' },
                { key: 'noicapCCHN', header: 'Nơi cấp chứng chỉ hành nghề' },
                { key: 'diachiBS', header: 'Địa chỉ' },
            ],

            patients: [],
            patientColumns: [
                { key: 'maBN', header: 'Mã bệnh nhân' },
                { key: 'cccdBN', header: 'CCCD' },
                { key: 'hotenBN', header: 'Tên bệnh nhân' },
                { key: 'ngaysinhBN', header: 'Ngày sinh' },
                { key: 'sdtBN', header: 'Số điện thoại' },
                { key: 'diachiBN', header: 'Địa chỉ' },
            ],
            patientColumns_full: [
                { key: 'maBN', header: 'Mã bệnh nhân' },
                { key: 'cccdBN', header: 'CCCD' },
                { key: 'hotenBN', header: 'Tên bệnh nhân' },
                { key: 'ngaysinhBN', header: 'Ngày sinh' },
                { key: 'sdtBN', header: 'Số điện thoại' },
                { key: 'emailBN', header: 'Email' },
                { key: 'soBHYT', header: 'Số bảo hiểm y tế' },
                { key: 'chieucao', header: 'Chiều cao' },
                { key: 'cannang', header: 'Cân nặng' },
                { key: 'nhommau', header: 'Nhóm máu' },
            ],

            specialties: [],
            specialtiesColumns: [
                { key: 'maCK', header: 'Mã chuyên khoa' },
                { key: 'tenCK', header: 'Tên chuyên khoa' },
            ],
            specialtiesColumns_full: [
                { key: 'maCK', header: 'Mã chuyên khoa' },
                { key: 'tenCK', header: 'Tên chuyên khoa' },
            ],

            medicines: [],
            medicines_min: [],
            medicineColumns: [
                { key: 'maThuoc', header: 'Mã thuốc' },
                { key: 'tenThuoc', header: 'Tên thuốc' },
                { key: 'soluongThuoc', header: 'Số lượng' },
                { key: 'donvitinhThuoc', header: 'Đơn vị tính' },
                { key: 'noisanxuatThuoc', header: 'Nơi sản xuất' },
            ],
            medicineColumns_full: [
            { key: 'maThuoc', header: 'Mã thuốc' },
                { key: 'tenThuoc', header: 'Tên thuốc' },
                { key: 'soluongThuoc', header: 'Số lượng' },
                { key: 'donvitinhThuoc', header: 'Đơn vị tính' },
                { key: 'noisanxuatThuoc', header: 'Nơi sản xuất' },
                { key: 'soluong_minThuoc', header: 'Số lượng tôi thiểu' },
            ],

            records: [],
            recordColumns: [
                { key: 'maHS', header: 'Mã hồ sơ' },
                { key: 'maBN', header: 'Mã bệnh nhân' },
                { key: 'ngaylapHS', header: 'Ngày lập hồ sơ' },
            ],
            recordColumns_full: [
                { key: 'maHS', header: 'Mã hồ sơ' },
                { key: 'maBN', header: 'Mã bệnh nhân' },
                { key: 'ngaylapHS', header: 'Ngày lập hồ sơ' },
            ],

            appointments: [],
            appointments_new: [],
            appointmentsColumns: [
                { key: 'maBN', header: 'Mã bệnh nhân' },
                { key: 'maBS', header: 'Mã bác sĩ' },
                { key: 'maCK', header: 'Mã chuyên khoa' },
                { key: 'ngaythangnam', header: 'Ngày hẹn' },
                { key: 'khunggio', header: 'Khung giờ' },
                { key: 'mota', header: 'Mô tả' },
            ],
            appointmentsColumns_full: [
                { key: 'mahen', header: 'Mã lịch hẹn' },
                { key: 'maBN', header: 'Mã bệnh nhân' },
                { key: 'maBS', header: 'Mã bác sĩ' },
                { key: 'maCK', header: 'Mã chuyên khoa' },
                { key: 'ngaythangnam', header: 'Ngày hẹn' },
                { key: 'khunggio', header: 'Khung giờ' },
                { key: 'mota', header: 'Mô tả' },
                { key: 'trangthai', header: 'Trạng thái' },
            ],

            schedules: [],
            doctor_role: [],
            doctor_big: []
        };
    },

    watch: {
        appointments_new: {
            handler(newList){
            },
            immediate: true, // Chạy ngay lập tức nếu doctor đã có sẵn
            deep: true,
        },

        admin: {
            handler(newDoctor) {
                if (newDoctor && newDoctor.maBS) {
                    this.wsService.connect();
                    this.wsService.ws.onopen = () => {
                        this.wsService.send({ type: 'init', doctorId: newDoctor.maBS });
                    };
                }
            },
            immediate: true, // Chạy ngay lập tức nếu doctor đã có sẵn
            deep: true, // Theo dõi các thay đổi trong thuộc tính lồng nhau của doctor
        },
    },


    computed: {

    },


    methods: {
        changeNav_value (name){
            this.nav_value = name
            this.active_index = -1
        },

        async getUser(){
           try {
                const user = this.authStore.user;
                if (!user || !user.id) {
                    this.errorMessage = 'Không tìm thấy thông tin người dùng';
                    return;
                }
                if (user.role === 'doctor' || user.role === 'admin') {
                    const doctor = await doctorService.get(user.id);
                    this.admin = doctor;
                if (doctor) {
                    this.userInfo = {
                        tenDangNhap: doctor.tenDangNhap || user.id,
                        fullName: doctor.tenBS || 'Không xác định',
                    };
                } else {
                    this.errorMessage = 'Không tìm thấy thông tin bác sĩ';
                }
                } else {
                    this.errorMessage = 'Vai trò người dùng không hợp lệ';
                }
            } catch (error) {
                console.error('Lỗi khi tải thông tin người dùng:', error);
                this.errorMessage = 'Không thể tải thông tin người dùng';
            }
        },

        updateArray(item){
            this.appointments = this.appointments.filter((row) => {
                return row.mahen !== item.obj.mahen;
            });
        },

        async updateAppointment_new(appointment){
            this.appointments_new = this.appointments_new.filter((row) => {
                return row.mahen !== appointment.obj.mahen;
            });
            await this.get_appointment()
        },

        async updateYesterdayChuaKhamAppointments() {
            try {
                // Lấy ngày hôm qua
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const dateString = yesterday.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD

                // Lấy danh sách cuộc hẹn theo trạng thái 'ChuaKham'
                const chuaKhamAppointments = await appointmentService.get_status('ChuaKham');

                // Lọc các cuộc hẹn của ngày hôm qua
                const yesterdayChuaKhamAppointments = chuaKhamAppointments.filter(appointment =>
                    appointment.ngaythangnam === dateString
                );

                // Cập nhật trạng thái thành 'Huy' cho từng cuộc hẹn
                const updatePromises = yesterdayChuaKhamAppointments.map(async (appointment) => {
                    // Sao chép đối tượng và cập nhật thuộc tính trangthai
                    const updatedAppointment = { ...appointment, trangthai: 'Huy' };
                    // Gọi update với mahen và toàn bộ đối tượng đã chỉnh sửa
                    return appointmentService.update(appointment.mahen, updatedAppointment);
                });

                // Chờ tất cả các cập nhật hoàn tất
                await Promise.all(updatePromises);

                console.log(`Đã cập nhật ${yesterdayChuaKhamAppointments.length} cuộc hẹn ChuaKham của ngày hôm qua thành Huy`);
            } catch (error) {
                console.error('Lỗi khi cập nhật các cuộc hẹn:', error);
            }
        },

        update_activeIndex(index){
            this.active_index = index
            if(index !== -1){
                if(this.nav_value === 'xemBAn'){
                    // Lấy thông tin bệnh nhân từ danh sách bệnh nhân
                    let patient_live = this.patients.filter(
                        patient => patient.maBN == this.records[index].maBN
                    );
                    
                    let patient_del = this.patients_del.filter(
                        patient => patient.maBN == this.records[index].maBN
                    );
                    this.patient = patient_live.length > 0 ? patient_live : patient_del;
                } else if(this.nav_value === 'xemBAn_Xoa'){
                    // Lấy thông tin bệnh nhân từ danh sách bệnh nhân đã xóa
                    let patient_del = this.patients_del.filter(
                        patient => patient.maBN == this.records_del[index].maBN
                    );

                    let patient_live = this.patients.filter(
                        patient => patient.maBN == this.records_del[index].maBN
                    );
                    this.patient = patient_del.length > 0 ? patient_del : patient_live;
                } 
                this.patient = this.patient[0]
            }
        },

        async get_appointment_new() {
            try {
               this.appointments_new = await appointmentService.get_status("ChuaKham")
            } catch (error) {
                console.log("Lỗi khi lấy các cuộc hẹn!", error);
            }
        },

        async get_appointment() {
            try {
                const [daKhamAppointments, huyAppointments] = await Promise.all([
                    appointmentService.get_status("DaKham"),
                    appointmentService.get_status("Huy")
                ]);

                // Gộp và loại bỏ trùng lặp dựa trên mahen
                const allAppointments = [...daKhamAppointments, ...huyAppointments];
                const uniqueAppointments = Array.from(
                    new Map(allAppointments.map(app => [app.mahen, app])).values()
                );

                this.appointments = uniqueAppointments;
                console.log('Danh sách cuộc hẹn:', this.appointments);
            } catch (error) {
                console.error('Lỗi khi lấy các cuộc hẹn:', {
                    error: error.message,
                    stack: error.stack
                });
            }
        },

        async get_prescriptions (){
          try {
            this.prescriptions = await prescriptionService.getAll()
          }catch (error){
            console.log("lỗi khi lấy toa thuốc: ", error)
          }
        },

        async get_records() {
            try {
                this.records = await recordService.getAll();
                this.records_del = await recordService.getDel();
            } catch (error) {
                console.log("Lấy danh sách hồ sơ khám bệnh không thành công:", error);
            }
        },

        async get_medicines() {
            try {
                this.medicines = await drugService.getAll();
                // Lọc các thuốc có soluongThuoc <= soluong_minThuoc
                this.medicines_min = this.medicines.filter(
                    medicine => medicine.soluongThuoc <= medicine.soluong_minThuoc
                );
                // Lấy danh sách thuốc đã xóa
                this.medicines_del = await drugService.getDel();
            } catch (error) {
                console.log("Lấy danh sách thuốc không thành công:", error);
            }
        },

        async get_doctors(){
            try{
                this.doctors = await doctorService.getAll()
                this.doctors_del = await doctorService.getDel();
            }catch (error){
                console.log("Lấy danh sách bác sĩ không thành công:", error)
            }
        },

        async get_patients(){
            try{
                this.patients = await patientService.getAll()
                this.patients_del = await patientService.getDel();
            }catch (error){
                console.log("Lấy danh sách bệnh nhân không thành công:", error)
            }
        },

        async get_specialties(){
            try{
                this.specialties = await specialtiesService.getAll()
                console.log(this.specialties)
            }catch (error){
                console.log("Lấy danh sách chuyên khoa không thành công", error)
            }
        },

        async get_schedules(){
            try{
                this.schedules = await working_timeService.getAll()
                console.log(this.schedules)
            }catch (error){
                console.log("Lấy lịch làm việc không thành công:", error)
            }
        },

        async get_doctorRole(){
            try{
                this.doctor_role = await doctor_roleService.getAll()
                console.log(this.doctor_role)
                this.doctor_big = this.mergeDoctorsAndRoles(this.doctors, this.doctor_role)
                console.log(this.doctor_big)
            }catch (error){
                console.log("Lấy vai trò bác sĩ không thành công:", error)
            }
        },

        mergeDoctorsAndRoles(doctors, doctor_role) {
            return doctors.map(doctor => {
                // Tìm phần tử trong doctor_role có maBS trùng với doctor.maBS
                const role = doctor_role.find(role => role.maBS === doctor.maBS);
                // Ghép thông tin từ doctor và role (nếu role tồn tại)
                return {
                ...doctor, // Giữ tất cả thuộc tính của doctor
                ...(role || {}) // Thêm các thuộc tính của role (nếu có)
                };
            });
        }
    },

    mounted() {
        this.wsService.onMessage((message) => {
            if (message.type === 'appointment_update') {
                this.get_appointment_new();
            } else if (message.type === 'appointment_examined') {
                this.get_appointment_new();
                this.get_appointment();
            } else if (message.type === 'drug_update') {
                this.get_medicines();
                this.get_prescriptions();
            } 
        });
        this.updateYesterdayChuaKhamAppointments()
        this.get_patients()
        this.get_doctors()
        this.get_medicines()
        this.get_records()
        this.get_specialties()
        this.get_schedules()
        this.get_doctorRole()
        this.get_prescriptions()
        this.get_appointment()
        this.get_appointment_new()

    },

    async created() {
        await this.getUser();
    },

    beforeDestroy() {
        this.wsService.disconnect();
    },
};

</script>
<style scoped>
    .page {
        text-align: left;
        max-width: 750px;
    }
</style>