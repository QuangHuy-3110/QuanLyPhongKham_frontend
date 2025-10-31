<template>
<div class="container">
    <h3 class="mb-4 text-center fw-bold">Hỗ trợ khách hàng</h3>
    <hr>
  <div class="admin-support-container">
    <div class="connection-status" :class="{ connected: isConnected }">
      Trạng thái: {{ isConnected ? 'Đã kết nối' : 'Đang kết nối...' }}
    </div>

    <div class="chat-layout">
      <div class="chat-list">
        <h3>Yêu cầu hỗ trợ</h3>
        <div
          v-for="chat in chatRequests"
          :key="chat.userId"
          class="chat-list-item"
          :class="{ active: selectedUserId === chat.userId, waiting: chat.state === 'waiting' }"
          @click="selectChat(chat.userId)"
        >
          <div class="user-id">🧑‍⚕️ {{ chat.userId }}</div>
          <div class="chat-state">{{ chat.state === 'waiting' ? 'Đang chờ...' : 'Đang chat...' }}</div>
        </div>
        <div v-if="!chatRequests.length" class="no-chats">
          Chưa có yêu cầu nào.
        </div>
      </div>

      <div class="chat-window">
        <div class="messages-history" ref="messagesHistory">
          <div v-if="!selectedUserId" class="no-chat-selected">
            Vui lòng chọn một cuộc trò chuyện.
          </div>
          
          <div
            v-for="msg in currentChatHistory"
            :key="msg.id"
            :class="['message', msg.from]"
          >
            <div class="message-sender">{{ msg.senderName }}</div>
            <div class="message-content">
              {{ msg.text }}
            </div>
          </div>
        </div>

        <div class="input-area" v-if="selectedUserId">
          <input
            v-model="inputMsg"
            @keyup.enter="sendMessage"
            placeholder="Nhập tin nhắn trả lời..."
            :disabled="!isConnected"
          />
          <button @click="sendMessage" :disabled="!isConnected || !inputMsg.trim()">
            Gửi
          </button>
          <button @click="endChat" class="btn-end-chat">
            Kết thúc
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'AdminSupportChat',
  data() {
    return {
      ws: null,
      isConnected: false,
      inputMsg: '',
      adminId: 'Admin', // ID cố định cho Admin
      
      chatRequests: [], // Danh sách các user { userId, state: 'waiting' | 'human' }
      chatHistories: {}, // Map<userId, message[]>
      selectedUserId: null,
      connectionCheckInterval: null,
    };
  },
  computed: {
    currentChatHistory() {
      if (!this.selectedUserId) return [];
      return this.chatHistories[this.selectedUserId] || [];
    }
  },
  mounted() {
    console.log('AdminSupportChat: Component Mounted. Connecting...');
    this.connectWebSocket();
    
    // ⚠️ MỚI: Bắt đầu một timer để tự động kiểm tra kết nối mỗi 10 giây
    // Điều này đảm bảo nếu mạng rớt, nó sẽ tự kết nối lại
    if (!this.connectionCheckInterval) {
        this.connectionCheckInterval = setInterval(this.ensureConnection, 10000);
    }
  },

  unmounted() {
    // Chỉ chạy khi component bị HỦY HOÀN TOÀN (ví dụ: admin logout)
    console.log('AdminSupportChat: Component Unmounted. Closing connection.');
    if (this.ws) {
      this.ws.onclose = null; // Ngăn logic tự kết nối lại
      this.ws.close();
      this.ws = null;
    }
    // Dọn dẹp timer
    if (this.connectionCheckInterval) {
        clearInterval(this.connectionCheckInterval);
        this.connectionCheckInterval = null;
    }
  },

  activated() {
    // ⚠️ MỚI: Chỉ chạy khi component được <keep-alive> và bạn quay lại
    console.log('AdminSupportChat: Component Activated. Ensuring connection...');
    this.ensureConnection(); // Kiểm tra kết nối ngay khi quay lại
    
    // Khởi động lại timer nếu nó đã bị dừng
    if (!this.connectionCheckInterval) {
        this.connectionCheckInterval = setInterval(this.ensureConnection, 10000);
    }
  },

  deactivated() {
    // ⚠️ MỚI: Chỉ chạy khi component được <keep-alive> và bạn rời đi
    console.log('AdminSupportChat: Component Deactivated. Timer paused.');
    // Chúng ta KHÔNG đóng WebSocket, nhưng chúng ta dừng timer để tiết kiệm tài nguyên
    if (this.connectionCheckInterval) {
        clearInterval(this.connectionCheckInterval);
        this.connectionCheckInterval = null;
    }
  },

  methods: {
    // ⚠️ MỚI: Hàm kiểm tra và kết nối lại
    ensureConnection() {
        if (!this.ws || this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING) {
            console.warn('Admin WS: Connection lost or not established. Reconnecting...');
            this.isConnected = false;
            this.connectWebSocket(); // Gọi kết nối lại
        } else {
            console.log('Admin WS: Connection is healthy.');
        }
    },

    connectWebSocket() {
      // ⚠️ SỬA: Ngăn kết nối trùng lặp
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          console.log('Admin WS: Already connected.');
          this.isConnected = true;
          return;
      }

      // Dọn dẹp kết nối cũ (nếu có) trước khi tạo mới
      if (this.ws) {
          this.ws.onclose = null;
          this.ws.close();
      }

      this.ws = new WebSocket('ws://localhost:3000');
      this.isConnected = false; // Đặt trạng thái đang kết nối

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('Admin WS: Connected to server.');
        // Gửi init message
        this.ws.send(JSON.stringify({
          type: 'init',
          doctorId: this.adminId,
        }));
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log('Admin received:', data); // Giữ log này nếu bạn muốn debug

        switch (data.type) {
          case 'new_support_request':
            this.handleNewSupportRequest(data.data);
            break;
          case 'human_chat_message':
            this.handleHumanMessage(data);
            break;
          case 'handoff_ended':
            this.handleChatEnded(data.userId, data.text);
            break;
          case 'waiting_list':
            console.log('Received waiting list:', data.data);
            data.data.forEach(user => this.handleNewSupportRequest(user));
            break;
        }
      };

      this.ws.onerror = (error) => {
        console.error('Admin WS Error:', error);
        this.isConnected = false;
        if (this.ws) {
            this.ws.close(); // Buộc đóng khi lỗi
        }
      };

      this.ws.onclose = () => {
        console.log('Admin WS Closed.');
        this.isConnected = false;
        this.ws = null; // Đặt ws về null để ensureConnection biết cần tạo mới
      };
    },

    handleNewSupportRequest(data) {
      const { userId, history } = data;
      const existingRequest = this.chatRequests.find(c => c.userId === userId);
      
      if (existingRequest) {
          existingRequest.state = 'waiting';
          return;
      }

      this.chatRequests.push({ userId, state: 'waiting' });
      
      const initialMessages = (history || []).map((msg, index) => ({
        id: `hist_${index}`,
        text: msg.text || '...',
        from: msg.from || 'user',
        senderName: msg.from === 'bot' ? 'Bot' : 'Bệnh nhân'
      }));
      
      initialMessages.push({
          id: Date.now(),
          text: '--- Bệnh nhân yêu cầu hỗ trợ trực tiếp ---',
          from: 'system',
          senderName: 'Hệ thống'
      });
      
      this.chatHistories[userId] = initialMessages;
      
      if (!this.selectedUserId) {
          this.selectChat(userId);
      }
    },

    handleHumanMessage(data) {
      const { userId, text } = data;
      if (!this.chatHistories[userId]) {
          this.chatHistories[userId] = [];
          this.chatRequests.push({ userId, state: 'human' });
      }
      
      this.chatHistories[userId].push({
        id: Date.now(),
        text: text,
        from: 'user',
        senderName: 'Bệnh nhân'
      });
      
      const chat = this.chatRequests.find(c => c.userId === userId);
      if (chat) chat.state = 'human';

      this.$nextTick(() => this.scrollToBottom());
    },

    handleChatEnded(userId, reason) {
        if (this.chatHistories[userId]) {
            this.chatHistories[userId].push({
                id: Date.now(),
                text: `--- ${reason || 'Cuộc trò chuyện đã kết thúc'} ---`,
                from: 'system',
                senderName: 'Hệ thống'
            });
            
            this.chatRequests = this.chatRequests.filter(c => c.userId !== userId);
            if (this.selectedUserId === userId) {
                this.selectedUserId = null;
            }
        }
    },

    selectChat(userId) {
      this.selectedUserId = userId;
      const chat = this.chatRequests.find(c => c.userId === userId);
      if (chat) chat.state = 'human';
      
      this.$nextTick(() => this.scrollToBottom());
    },

    sendMessage() {
      if (!this.inputMsg.trim() || !this.selectedUserId) return;
      const messageText = this.inputMsg;
      
      this.ws.send(JSON.stringify({
        type: 'human_chat_message',
        sender: 'Admin',
        recipientId: this.selectedUserId,
        text: messageText
      }));

      this.chatHistories[this.selectedUserId].push({
        id: Date.now(),
        text: messageText,
        from: 'admin',
        senderName: 'Admin (Bạn)'
      });
      
      this.inputMsg = '';
      this.$nextTick(() => this.scrollToBottom());
    },
    
    endChat() {
        if (!this.selectedUserId) return;
        const userIdToEnd = this.selectedUserId;
        
        this.ws.send(JSON.stringify({
            type: 'end_human_chat',
            userId: userIdToEnd,
            initiatedBy: 'Admin'
        }));
        
        this.handleChatEnded(userIdToEnd, 'Bạn đã kết thúc trò chuyện.');
    },

    scrollToBottom() {
      const history = this.$refs.messagesHistory;
      if (history) {
        history.scrollTop = history.scrollHeight;
      }
    }
  },

};
</script>

<style scoped>
.admin-support-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  font-family: Arial, sans-serif;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.connection-status {
  padding: 5px 10px;
  background: #f8d7da;
  color: #721c24;
  text-align: center;
  font-size: 14px;
}
.connection-status.connected {
  background: #d4edda;
  color: #155724;
}

.chat-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Cột 1: Danh sách chat */
.chat-list {
  width: 250px;
  border-right: 1px solid #ddd;
  background: #f9f9f9;
  overflow-y: auto;
}
.chat-list h3 {
  padding: 10px;
  margin: 0;
  background: #f1f1f1;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
}
.chat-list-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.chat-list-item:hover {
  background: #e9e9e9;
}
.chat-list-item.active {
  background: #007bff;
  color: white;
}
.user-id {
  font-weight: bold;
}
.chat-state {
  font-size: 12px;
  opacity: 0.8;
}
.chat-list-item.waiting .chat-state {
  color: #dc3545;
  font-weight: bold;
}
.no-chats {
  padding: 10px;
  color: #777;
  text-align: center;
}

/* Cột 2: Cửa sổ chat */
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}
.no-chat-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-size: 18px;
}
.messages-history {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin-bottom: 5px;
}
.message.user, .message.system {
  align-self: flex-start;
  align-items: flex-start;
}
.message.admin {
  align-self: flex-end;
  align-items: flex-end;
}
.message-sender {
  font-size: 0.75rem;
  color: #6c757d;
  margin-left: 5px;
  margin-bottom: 2px;
}
.message.admin .message-sender {
  text-align: right;
  margin-right: 5px;
}
.message.user .message-sender { color: #007bff; }
.message.admin .message-sender { color: #28a745; }
.message.system .message-sender { color: #6c757d; }

.message-content {
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
  max-width: 100%;
}
.message.user .message-content {
  background: #e9ecef;
  color: #333;
  border-bottom-left-radius: 4px;
}
.message.admin .message-content {
  background: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
}
.message.system .message-content {
  background: #fff3cd;
  color: #856404;
  border-radius: 4px;
  width: 100%;
  text-align: center;
}

.input-area {
  display: flex;
  padding: 10px;
  background: white;
  border-top: 1px solid #ddd;
  gap: 10px;
}
.input-area input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
}
.input-area button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
.input-area button:disabled {
  background: #ccc;
}
.btn-end-chat {
    background: #dc3545 !important;
}
.btn-end-chat:hover {
    background: #c82333 !important;
}
</style>