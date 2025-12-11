<template>
  <div class="chat-container">
    <div class="messages-history" ref="messagesHistory">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message', msg.from]"
      >
        <div class="message-sender" v-if="msg.from !== 'user'">
          {{ msg.senderName || 'Bot' }}
        </div>
        
        <div class="message-content">
          <div v-if="msg.from === 'bot' || msg.from === 'admin'" v-html="msg.text"></div>
          <div v-else>{{ msg.text }}</div>
        </div>
        
        <div v-if="msg.from === 'bot' && msg.buttons && msg.buttons.length && !isHumanMode" class="buttons">
          <button
            v-for="(btn, btnIndex) in msg.buttons"
            :key="btnIndex"
            @click="sendButtonPayload(btn.payload, btn.title)"
          >
            {{ btn.title }}
          </button>
        </div>
      </div>
    </div>
   
    <div class="input-area">
      <input
        v-model="inputMsg"
        @keyup.enter="sendMessage"
        :placeholder="isHumanMode ? 'Nhập tin nhắn cho hỗ trợ viên...' : 'Nhập tin nhắn cho Bot...'"
        ref="inputMsg"
        :disabled="isConnecting"
      />
      <button @click="sendMessage" :disabled="isConnecting || !inputMsg.trim()">
        {{ isConnecting ? 'Đang kết nối...' : 'Gửi' }}
      </button>
    </div>

    <div v-if="isHumanMode" class="human-chat-footer">
      <span>💬 Bạn đang chat trực tiếp với hỗ trợ viên.</span>
      <button @click="endHumanChat">Kết thúc trò chuyện</button>
    </div>

  </div>
</template>



<script>
import { useAuthStore } from "@/stores/authStore";
// import { watch } from 'vue'; // Dòng này đã có

export default {
  data() {
    return {
      ws: null,
      messages: [],
      inputMsg: '',
      userId: null,
      isConnecting: true,
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      isHumanMode: false, // ⚠️ MỚI: Trạng thái chat với người
    };
  },

  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },

  computed: {
    isLoggedIn() {
      return this.authStore.isLoggedIn;
    },

    currentUserId() {
      // Ưu tiên maBN, fallback sang user.id
      const user = this.authStore.user;
      return user?.maBN || user?.id || null;
    }
  },

  watch: {
    isLoggedIn(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log('🔄 Login status changed, reconnecting WebSocket...');
        this.reconnectWebSocket();
      }
    }
  },

  mounted() {
    this.authStore.loadUser();
    this.initializeChat();
  },

  methods: {

    initializeChat() {
      // Set userId
      if (this.isLoggedIn && this.currentUserId) {
        this.userId = this.currentUserId;
        console.log('✅ Logged-in userId:', this.userId);
      } else {
        this.userId = `guest_${Date.now()}`;
        console.log('👤 Guest mode, userId:', this.userId);
      }
      this.connectWebSocket();
    },

    connectWebSocket() {
      this.isConnecting = true;
      this.ws = new WebSocket('ws://localhost:3000');

      this.ws.onopen = () => {
        console.log('✅ Connected to backend');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        // ⚠️ FIX: Kiểm tra login status rõ ràng trước khi gửi init
        if (this.isLoggedIn && this.authStore.token && this.currentUserId) {
          // User đã login → Gửi init_patient với token
          console.log('🔐 Sending init_patient with token for:', this.userId);
          this.ws.send(JSON.stringify({
            type: 'init_patient',
            patientId: this.userId,
            token: this.authStore.token
          }));
        } else {
          // Guest → Gửi init_guest KHÔNG có token
          console.log('👤 Sending init_guest (no token) for:', this.userId);
          this.ws.send(JSON.stringify({
            type: 'init_guest',
            guestId: this.userId
          }));
        }
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'bot_response') {
          // (Code cũ)
          data.data.messages.forEach(msg => {
            if (msg.text) {
              this.messages.push({
                id: Date.now() + Math.random(),
                text: msg.text,
                from: 'bot',
                senderName: 'Bot', // ⚠️ MỚI
                buttons: msg.buttons || []
              });
            }
          });
        
        // ⚠️ MỚI: Xử lý tin nhắn từ Admin
        } else if (data.type === 'human_chat_message') {
            this.messages.push({
                id: Date.now() + Math.random(),
                text: data.text,
                from: 'admin',
                senderName: 'Hỗ trợ viên', // ⚠️ MỚI
            });
            this.isHumanMode = true; // Đảm bảo chuyển sang mode human nếu admin nhắn trước
        
        // ⚠️ MỚI: Server xác nhận bắt đầu handoff
        } else if (data.type === 'handoff_initiated') {
            this.messages.push({
                id: Date.now() + Math.random(),
                text: data.text,
                from: 'bot', // Gửi từ hệ thống
                senderName: 'Hệ thống',
            });
            this.isHumanMode = true; // Chuyển sang chế độ chat với người
        
        // ⚠️ MỚI: Server xác nhận kết thúc handoff
        } else if (data.type === 'handoff_ended') {
            this.messages.push({
                id: Date.now() + Math.random(),
                text: data.text,
                from: 'bot',
                senderName: 'Hệ thống',
            });
            this.isHumanMode = false; // Quay lại chat với Bot
        }

        this.$nextTick(() => this.scrollToBottom());
      };

      // (onclose, onerror giữ nguyên)
      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log('⚠️ WebSocket closed');
        this.isConnecting = false;
        this.attemptReconnect();
      };
    },

    reconnectWebSocket() {
      if (this.ws) {
        this.ws.close();
      }
      // Cập nhật userId nếu login status đổi
      if (this.isLoggedIn && this.currentUserId) {
        this.userId = this.currentUserId;
      } else {
        this.userId = `guest_${Date.now()}`;
      }
      this.connectWebSocket(); 

      // ⚠️ MỚI: Gửi update login status đến server
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'update_login_status',
          userId: this.userId,
          token: this.authStore.token || null
        }));
      }
    },

    attemptReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        console.log(`🔄 Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        setTimeout(() => this.connectWebSocket(), delay);
      } else {
        console.error('❌ Max reconnect attempts reached');
        this.messages.push({
          id: Date.now(),
          text: '❌ Mất kết nối với server. Vui lòng tải lại trang.',
          from: 'bot'
        });
      }
    },

    sendMessage() {
      if (!this.inputMsg.trim()) return;

      const userMsg = {
        id: Date.now(),
        text: this.inputMsg,
        from: 'user'
      };
      this.messages.push(userMsg);
     
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        
        // ⚠️ SỬA: Gửi tin nhắn tùy theo chế độ
        if (this.isHumanMode) {
          // Gửi cho Admin
          this.ws.send(JSON.stringify({
            type: 'human_chat_message',
            sender: 'Patient', // Báo cho server biết đây là Bệnh nhân
            userId: this.userId,
            text: this.inputMsg
          }));
        } else {
          // Gửi cho Rasa (như cũ)
          this.ws.send(JSON.stringify({
            type: 'chat_message',
            userId: this.userId,
            message: this.inputMsg
          }));
        }

      } else {
        // (Xử lý lỗi như cũ)
        this.messages.push({
          id: Date.now() + 1,
          text: '⚠️ Không thể gửi tin nhắn. Vui lòng thử lại.',
          from: 'bot'
        });
      }
     
      this.inputMsg = '';
      if (this.$refs.inputMsg) this.$refs.inputMsg.focus();
      this.$nextTick(() => this.scrollToBottom());
    },

    sendButtonPayload(payload, title) {
      
      // ⚠️ MỚI: Xử lý Handoff payload đặc biệt
      if (payload === 'HANDOFF_TO_HUMAN') {
        const userMsg = {
          id: Date.now() + Math.random(),
          text: title, // Hiển thị "Kết nối hỗ trợ viên"
          from: 'user'
        };
        this.messages.push(userMsg);
        
        // Gửi yêu cầu Handoff đến server
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'request_human_handoff',
                userId: this.userId,
                // Gửi tin nhắn cuối cùng của bot để admin biết ngữ cảnh
                context: this.messages.slice(-5) 
            }));
        }
        this.$nextTick(() => this.scrollToBottom());
        return; // Dừng lại, không gửi cho Rasa
      }

      // Logic cũ: Gửi payload cho Rasa
      const userMsg = {
        id: Date.now() + Math.random(),
        text: title || payload,
        from: 'user'
      };
      this.messages.push(userMsg);
     
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'chat_message',
          userId: this.userId,
          message: payload
        }));
      }
     
      this.$nextTick(() => this.scrollToBottom());
    },

    // ⚠️ MỚI: Hàm kết thúc chat với người
    endHumanChat() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'end_human_chat',
                userId: this.userId
            }));
        }
        this.isHumanMode = false;
        this.messages.push({
            id: Date.now(),
            text: 'Đã kết thúc trò chuyện trực tiếp. Bạn quay lại chat với Bot.',
            from: 'bot',
            senderName: 'Hệ thống',
        });
    },




    scrollToBottom() {
      const history = this.$refs.messagesHistory;
      if (history) {
        history.scrollTop = history.scrollHeight;
      }
    }
  },

  beforeUnmount() {
    if (this.ws) this.ws.close();
    this.messages = [];
  }

};

</script>



<style scoped>

.chat-container {
  display: flex;
  flex-direction: column;
  height: 73vh;
  max-width: 600px;
  margin: 0 auto;
  background: #f5f5f5;
  font-family: Arial, sans-serif;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* ⚠️ MỚI: Guest banner */
.guest-banner {
  background: #fff3cd;
  color: #856404;
  padding: 10px 15px;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid #ffc107;
}

.guest-banner .login-link {
  color: #007bff;
  text-decoration: underline;
  font-weight: bold;
}

.guest-banner .login-link:hover {
  color: #0056b3;
}

.messages-history {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin-bottom: 5px;
}

.message.user {
  align-self: flex-end;
  align-items: flex-end;
}

.message.bot {
  align-self: flex-start;
  align-items: flex-start;
}

.message-content {
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
  max-width: 100%;
}

.message.user .message-content {
  background: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .message-content {
  background: white;
  color: #333;
  border: 1px solid #ddd;
  border-bottom-left-radius: 4px;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.buttons button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.buttons button:hover {
  background: #5a6268;
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

.input-area input:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
}

.input-area button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.input-area button:hover:not(:disabled) {
  background: #0056b3;
}

.input-area button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.messages-history::-webkit-scrollbar {
  width: 6px;
}

.messages-history::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-history::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

/* ⚠️ MỚI: Style cho tên người gửi */
.message-sender {
  font-size: 0.75rem;
  color: #6c757d;
  margin-left: 5px;
  margin-bottom: 2px;
}
.message.user .message-sender {
  display: none; /* Không cần hiển thị tên cho user */
}

.message.bot .message-sender {
  color: #007bff;
}
.message.admin .message-sender {
  color: #28a745; /* Admin màu xanh lá */
}

/* ⚠️ MỚI: Style cho tin nhắn của Admin */
.message.admin .message-content {
  background: #e6f7ec; /* Nền xanh lá nhạt */
  color: #333;
  border: 1px solid #b7e8c9;
  border-bottom-left-radius: 4px;
}

/* ⚠️ MỚI: Footer khi chat với người */
.human-chat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #fff3cd;
  color: #856404;
  font-size: 14px;
}
.human-chat-footer button {
  padding: 4px 8px;
  font-size: 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.human-chat-footer button:hover {
  background: #c82333;
}
</style>