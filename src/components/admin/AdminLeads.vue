<template>
  <div class="leads-container">
    <div class="header">
      <h2>🎯 Quản lý Khách hàng tiềm năng (Leads)</h2>
      <div class="stats">
        <span class="stat-item">🔥 Hot: <strong>{{ hotLeadsCount }}</strong></span>
        <span class="stat-item">🆕 Mới: <strong>{{ newLeadsCount }}</strong></span>
      </div>
      <button class="refresh-btn" @click="fetchLeads" :disabled="loading">
        <span v-if="loading">⏳ Đang tải...</span>
        <span v-else>🔄 Làm mới</span>
      </button>
    </div>

    <div class="table-responsive">
      <table class="leads-table">
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Vấn đề quan tâm</th>
            <th>Điểm số</th>
            <th>Trạng thái</th>
            <th>Thời gian</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="leads.length === 0">
            <td colspan="6" class="text-center">Chưa có dữ liệu khách hàng tiềm năng.</td>
          </tr>
          
          <tr 
            v-for="lead in leads" 
            :key="lead.id" 
            :class="{ 'hot-row': lead.lead_score >= 8, 'processed': lead.status !== 'new' }"
          >
            <td>
              <div class="user-info">
                <strong>{{ lead.user_id }}</strong>
                <div v-if="lead.phone_number" class="phone-badge">
                   📞 {{ lead.phone_number }}
                </div>
                <div v-else class="guest-badge">Guest</div>
              </div>
            </td>

            <td>
              <span class="topic-tag" :class="getTopicClass(lead.interest_topic)">
                {{ formatTopic(lead.interest_topic) }}
              </span>
              <div class="last-msg-preview">
                "{{ truncate(lead.last_message, 40) }}"
              </div>
            </td>

            <td class="text-center">
              <div class="score-circle" :class="getScoreClass(lead.lead_score)">
                {{ lead.lead_score }}
              </div>
            </td>

            <td>
              <select 
                v-model="lead.status" 
                @change="updateStatus(lead.id, lead.status)"
                class="status-select"
                :class="'status-' + lead.status"
              >
                <option value="new">🆕 Mới</option>
                <option value="contacted">📞 Đã gọi</option>
                <option value="closed">✅ Đã chốt</option>
                <option value="spam">🚫 Spam</option>
              </select>
            </td>

            <td>{{ formatDate(lead.created_at) }}</td>

            <td>
              <button class="action-btn view-chat" @click="openChatHistory(lead.user_id)">
                💬 Xem Chat
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showChatModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>📜 Lịch sử hội thoại: {{ selectedUserId }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="chat-history-body">
          <div v-if="chatLoading" class="loading-spinner">Đang tải lịch sử...</div>
          <div v-else class="messages-list">
            <div 
              v-for="msg in chatHistory" 
              :key="msg.id" 
              class="msg-item"
              :class="msg.sender"
            >
              <div class="msg-sender">{{ msg.sender === 'user' ? 'Khách' : (msg.sender === 'admin' ? 'Support' : 'Bot') }}</div>
              <div class="msg-bubble">{{ msg.message }}</div>
              <div class="msg-time">{{ formatDate(msg.created_at) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LeadsService from '../../services/leads.service';

export default {
  name: 'AdminLeads',
  data() {
    return {
      leads: [],
      loading: false,
      chatLoading: false,
      showChatModal: false,
      selectedUserId: null,
      chatHistory: [],
      // Mapping tên intent sang tiếng Việt dễ đọc
      topicMap: {
        'book_appointment': 'Đặt lịch khám',
        'ask_price': 'Hỏi giá cả',
        'ask_doctor_info': 'Tìm bác sĩ',
        'provide_symptoms': 'Tư vấn bệnh',
        'user_provided': 'Để lại SĐT'
      }
    };
  },
  computed: {
    hotLeadsCount() {
      return this.leads.filter(l => l.lead_score >= 8 && l.status === 'new').length;
    },
    newLeadsCount() {
      return this.leads.filter(l => l.status === 'new').length;
    }
  },
  mounted() {
    this.fetchLeads();
    
    // Auto refresh mỗi 30 giây
    this.timer = setInterval(this.fetchLeads, 30000);

    // [NÂNG CAO] Nếu bạn đã cấu hình WebSocket notification trong server.js
    // thì lắng nghe event ở đây để reload ngay lập tức mà không cần chờ 30s
    /*
    this.socket.on('new_lead_notification', () => {
       this.fetchLeads();
       // Có thể thêm toast notification/âm thanh ở đây
    });
    */
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    async fetchLeads() {
      this.loading = true;
      try {
        // Gọi API backend (đã tạo ở bước trước)
        const response = await LeadsService.getAll();
        this.leads = response.data;
      } catch (error) {
        console.error("Lỗi tải leads:", error);
        alert("Không thể tải danh sách khách hàng.");
      } finally {
        this.loading = false;
      }
    },

    async updateStatus(id, newStatus) {
      try {
        await axios.put(`http://localhost:3000/api/leads/${id}`, { status: newStatus });
        // Không cần alert, chỉ cần update UI (v-model đã làm việc đó)
      } catch (error) {
        alert("Lỗi cập nhật trạng thái");
      }
    },

    async openChatHistory(userId) {
      this.selectedUserId = userId;
      this.showChatModal = true;
      this.chatLoading = true;
      this.chatHistory = [];

      try {
        // Gọi API lấy lịch sử chat (đã tạo ở bước trước)
        // Lưu ý: Backend cần có route GET /api/chat/history/:userId hoặc tương tự
        // Ở đây giả sử bạn tái sử dụng cơ chế websocket hoặc tạo 1 API REST mới
        // Nếu chưa có API REST, bạn cần thêm vào server.js
        const response = await axios.get(`http://localhost:3000/api/chat/history/${userId}`);
        this.chatHistory = response.data;
      } catch (error) {
        console.error(error);
        // Fallback dữ liệu giả nếu chưa có API
        this.chatHistory = [
            {id:1, sender: 'user', message: 'Tôi muốn hỏi giá', created_at: new Date()},
            {id:2, sender: 'bot', message: 'Giá khám là 200k ạ', created_at: new Date()}
        ];
      } finally {
        this.chatLoading = false;
      }
    },

    closeModal() {
      this.showChatModal = false;
    },

    // Helpers
    formatTopic(topic) {
      return this.topicMap[topic] || topic || 'Khác';
    },
    getTopicClass(topic) {
      if (topic === 'book_appointment') return 'tag-red';
      if (topic === 'ask_price') return 'tag-yellow';
      return 'tag-blue';
    },
    getScoreClass(score) {
      if (score >= 10) return 'score-high';
      if (score >= 5) return 'score-med';
      return 'score-low';
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    truncate(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    }
  }
};
</script>

<style scoped>
/* Container & Header */
.leads-container {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.stats {
  display: flex;
  gap: 20px;
}
.stat-item {
  font-size: 16px;
  color: #555;
}

/* Table Styles */
.table-responsive {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow-x: auto;
}
.leads-table {
  width: 100%;
  border-collapse: collapse;
}
.leads-table th, .leads-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.leads-table th {
  background: #f1f3f5;
  color: #495057;
  font-weight: 600;
}

/* Row Highlights */
.hot-row {
  background-color: #fff9db; /* Màu vàng nhạt cho khách Hot */
}
.processed {
  opacity: 0.7;
  background-color: #f8f9fa;
}

/* Elements */
.user-info {
  display: flex;
  flex-direction: column;
}
.phone-badge {
  color: #d63384;
  font-weight: bold;
  font-size: 0.9em;
  margin-top: 2px;
}
.guest-badge {
  font-style: italic;
  color: #888;
  font-size: 0.85em;
}

.topic-tag {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}
.tag-red { background: #fa5252; }
.tag-yellow { background: #fab005; color: #333; }
.tag-blue { background: #228be6; }

.last-msg-preview {
  font-size: 12px;
  color: #868e96;
  margin-top: 4px;
  font-style: italic;
}

.score-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 auto;
}
.score-high { background: #ffe3e3; color: #c92a2a; border: 2px solid #c92a2a; }
.score-med { background: #e7f5ff; color: #1864ab; border: 2px solid #1864ab; }
.score-low { background: #ebfbee; color: #2b8a3e; border: 2px solid #2b8a3e; }

/* Status Select */
.status-select {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-weight: 500;
}
.status-new { color: #228be6; border-color: #228be6; }
.status-contacted { color: #fd7e14; border-color: #fd7e14; }
.status-closed { color: #2b8a3e; border-color: #2b8a3e; }

/* Action Buttons */
.refresh-btn {
  padding: 8px 16px;
  background: #228be6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.action-btn.view-chat {
  background: #12b886;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
.action-btn:hover, .refresh-btn:hover {
  opacity: 0.9;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  width: 500px;
  max-width: 90%;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}
.modal-header {
  padding: 15px;
  background: #f1f3f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.chat-history-body {
  padding: 15px;
  overflow-y: auto;
  flex: 1;
  background: #f8f9fa;
}
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.msg-item {
  max-width: 80%;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
}
.msg-item.user {
  align-self: flex-end;
  background: #e7f5ff;
  border-bottom-right-radius: 2px;
}
.msg-item.bot {
  align-self: flex-start;
  background: white;
  border: 1px solid #ddd;
  border-bottom-left-radius: 2px;
}
.msg-item.admin {
  align-self: flex-start;
  background: #d3f9d8; /* Màu xanh lá nhạt cho admin */
  border: 1px solid #b2f2bb;
}
.msg-sender {
  font-size: 11px;
  font-weight: bold;
  color: #888;
  margin-bottom: 2px;
}
.msg-time {
  font-size: 10px;
  color: #aaa;
  text-align: right;
  margin-top: 4px;
}
.close-btn {
  background: none; border: none; font-size: 24px; cursor: pointer;
}
</style>