<template>
    <main class="container bg-light">
        <!-- Floating Chatbot Window -->
        <div v-show="showChatbot" class="chatbot-floating-window" :style="{ zIndex: 10001 }">
            <div class="chatbot-header">
                <h5>Chatbot Assistant</h5>
                <button class="btn-close" @click="toggleChatbot">&times;</button>
            </div>
            <div ref="chatbotBody" class="chatbot-body">
                <Chatbot :patient="patient" @newMessage="scrollToBottom" />
            </div>
        </div>
        
        <!-- Toggle Button for Chatbot -->
        <button v-show="!showChatbot" 
                class="chatbot-toggle-btn" 
                @click="toggleChatbot"
                style="position: fixed; bottom: 20px; right: 20px; z-index: 10000;">
            <i class="fas fa-comments"></i> Chat
        </button>

        <Home v-if="nav_value === 'trangchu'" />

        <Book_form v-if="nav_value === 'lichkham'" 
                   :patient="patient"
                   @appointmentBooked="get_list_appointment"/>

        <Examination v-if="nav_value === 'hsbenhan'" 
                     :patient="patient"
                     @update:patient="this.$emit('update:patient1', $event)"/>
        
        <TableForm v-if="nav_value === 'lichhen'" 
                   :array="{ list: list_appointment }"
                   :columns="appointmentColumns"
                   :columns_full="appointmentColumns"
                   :patient="patient"
                   :name="'lichhen'"
                   :role="'patient'"
                   v-model:activeIndex="activeIndex"
                   data-bs-toggle="modal" data-bs-target="#exampleModal"/>
    </main>
</template>

<script>
    import Home from '../../components/patient/home.vue';
    import Book_form from '../../components/patient/book_form.vue';
    import Examination from '../../components/doctor/examination.vue';
    import TableForm from '../../components/element/table.vue';
    import appointmentService from '../../services/appointment.service';
    import WebSocketService from '../../services/ws.service';
    import Chatbot from '../../components/Chatbot.vue';

    export default {
        props: {
            nav_value: { type: String, default: "" },
            patient: { type: Object, required: true }
        },
        emits: ['update:patient1'],
        components: {
            Book_form,
            Examination,
            TableForm,
            Home,
            Chatbot
        },

        data() {
            return {
                activeIndex: -1,
                showChatbot: false,
                wsService: new WebSocketService(),
                list_appointment: [],
                appointmentColumns: [
                    { key: 'maBN', header: 'Mã bệnh nhân' },
                    { key: 'maBS', header: 'Mã bác sĩ' },
                    { key: 'ngaythangnam', header: 'Ngày đặt lịch' },
                    { key: 'khunggio', header: 'Khung giờ hẹn' },
                    { key: 'mota', header: 'Mô tả' },  
                    { key: 'trangthai', header: 'Trạng thái' },  
                ],
            }
        },

        watch: {
            list_appointment: {
                handler(newList) {
                },
                immediate: true,
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
                immediate: true,
                deep: true,
            },

            showChatbot(newVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        this.scrollToBottom();
                    });
                }
            }
        },

        methods: {
            async get_list_appointment() {
                try {
                    this.list_appointment = await appointmentService.get_patient(this.patient.maBN);
                } catch (error) {
                    console.log('Lỗi khi lấy danh sách lịch hẹn!', error);
                }
            },

            toggleChatbot() {
                this.showChatbot = !this.showChatbot;
            },

            scrollToBottom() {
                this.$nextTick(() => {
                    if (this.$refs.chatbotBody) {
                        this.$refs.chatbotBody.scrollTop = this.$refs.chatbotBody.scrollHeight;
                    }
                });
            }
        },

        mounted() {
            this.wsService.onMessage((message) => {
                if (message.type === 'appointment_cancelled') {
                    this.get_list_appointment();
                } else if (message.type === 'appointment_examined') {
                    this.get_list_appointment();
                }
            });           
        }
    }
</script>

<style scoped>
.chatbot-floating-window {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 600px;
    height: 600px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.chatbot-header {
    background: #007bff;
    color: white;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.chatbot-header h5 {
    margin: 0;
    font-size: 16px;
}

.btn-close {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chatbot-body {
    flex: 1;
    padding: 10px;
    overflow-y: hidden;
    background: #f8f9fa;
}

.chatbot-toggle-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #007bff;
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
}

.chatbot-toggle-btn:hover {
    transform: scale(1.05);
}

/* Font Awesome icon (giả sử đã import) */
.fas {
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
}
</style>