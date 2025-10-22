<template>
  <div class="chat-container">
    <!-- Lịch sử tin nhắn (scrollable) -->
    <div class="messages-history" ref="messagesHistory">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message', msg.from]"
      >
        <div class="message-content">
          <div v-if="msg.from === 'bot'" v-html="msg.text"></div>  <!-- Render HTML cho bot -->
          <div v-else>{{ msg.text }}</div>  <!-- Text thuần cho user -->
        </div>
        <!-- Buttons chỉ hiển thị cho bot messages có buttons -->
        <div v-if="msg.from === 'bot' && msg.buttons && msg.buttons.length" class="buttons">
          <button
            v-for="(btn, btnIndex) in msg.buttons"
            :key="btnIndex"
            @click="sendButtonPayload(btn.payload)"
          >
            {{ btn.title }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Input và gửi tin nhắn -->
    <div class="input-area">
      <input
        v-model="inputMsg"
        @keyup.enter="sendMessage"
        placeholder="Nhập tin nhắn..."
        ref="inputMsg"
      />
      <button @click="sendMessage">Gửi</button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";  // Import store của bạn

export default {
  data() {
    return {
      ws: null,
      messages: [],  // Lưu toàn bộ lịch sử: user và bot (text + buttons nếu có)
      inputMsg: '',
      userId: null,  // Động: maBN (patientId) hoặc guestId
      botMessages: []  // Tạm giữ để parse, nhưng merge vào messages
    };
  },
  setup() {
    const authStore = useAuthStore();  // Lấy store (composable)
    return { authStore };
  },
  computed: {
    isLoggedIn() {
      return this.authStore.isLoggedIn;  // Dùng getter từ store
    },
    currentUserId() {
      // Lấy maBN từ user (giả sử API login trả { maBN: 'BN123' } cho role 'benhnhan')
      return this.authStore.user ? this.authStore.user.maBN || this.authStore.user.patientId : null;
    }
  },
  mounted() {
    // Load store ngay để sync token/user từ storage
    this.authStore.loadUser();

    // Set userId ban đầu dựa trên trạng thái
    if (this.isLoggedIn && this.currentUserId) {
      this.userId = this.currentUserId;  // Dùng maBN nếu logged-in
      console.log('Chatbot: Logged-in userId:', this.userId);
    } else {
      this.userId = `guest_${Date.now()}`;  // Guest tạm thời
      console.log('Chatbot: Guest mode, userId:', this.userId);
    }

    // Kết nối WS
    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onopen = () => {
      console.log('Connected to backend');
      if (this.isLoggedIn) {
        // Đã login: Gửi maBN + token từ store
        this.ws.send(JSON.stringify({ 
          type: 'init_patient', 
          patientId: this.userId,  // Gửi maBN làm patientId (khớp server.js)
          token: this.authStore.token  // Token từ store (đã verify qua jwtDecode)
        }));
      } else {
        // Guest: Không token, chỉ guestId
        this.ws.send(JSON.stringify({ 
          type: 'init_guest', 
          guestId: this.userId
        }));
      }
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'bot_response') {
        this.botMessages = data.data.messages;  // Lưu full array từ Rasa
        // Thêm từng message từ Rasa vào lịch sử (text + buttons)
        data.data.messages.forEach(msg => {
          if (msg.text) {
            this.messages.push({
              id: Date.now() + Math.random(),  // Unique ID
              text: msg.text,
              from: 'bot',
              buttons: msg.buttons || []  // Giữ buttons nếu có
            });
          }
        });
        // Scroll xuống cuối
        this.$nextTick(() => this.scrollToBottom());
      }
    };

    this.ws.onerror = (error) => console.error('WS error:', error);
  },

  methods: {
    sendMessage() {
      if (this.inputMsg.trim()) {
        // Thêm tin nhắn user vào lịch sử ngay lập tức
        const userMsg = {
          id: Date.now(),
          text: this.inputMsg,
          from: 'user'
        };
        this.messages.push(userMsg);
        
        // Gửi đến backend với userId động
        this.ws.send(JSON.stringify({
          type: 'chat_message',
          userId: this.userId,
          message: this.inputMsg
        }));
        
        // Clear input
        this.inputMsg = '';
        if (this.$refs.inputMsg) this.$refs.inputMsg.focus();  // Focus lại input
        
        // Scroll xuống cuối
        this.$nextTick(() => this.scrollToBottom());
      }
    },
    sendButtonPayload(payload) {
      // Thêm action user vào lịch sử
      const userMsg = {
        id: Date.now() + Math.random(),
        text: `Bạn chọn: ${payload}`,
        from: 'user'
      };
      this.messages.push(userMsg);
      
      // Gửi payload đến backend
      this.ws.send(JSON.stringify({
        type: 'chat_message',
        userId: this.userId,
        message: payload  // Gửi payload như message (Rasa sẽ trigger intent)
      }));
      
      // Scroll xuống cuối
      this.$nextTick(() => this.scrollToBottom());
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
    // Optional: Clear messages khi unmount
    this.messages = [];
  }
};
</script>

<style scoped>
/* Giữ nguyên style từ code cũ của bạn */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 60vh;  /* Full height cho chat */
  max-width: 600px;
  margin: 0 auto;
  background: #f5f5f5;
  font-family: Arial, sans-serif;
}

.messages-history {
  flex: 1;
  overflow-y: auto;  /* Scrollable lịch sử */
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
  background: #007bff;  /* Màu xanh cho user */
  color: white;
  border-bottom-right-radius: 4px;  /* Bo góc trái cho bubble user */
}

.message.bot .message-content {
  background: white;  /* Màu trắng/xám cho bot */
  color: #333;
  border: 1px solid #ddd;
  border-bottom-left-radius: 4px;  /* Bo góc phải cho bot bubble */
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.buttons button {
  background: #6c757d;  /* Màu xám cho buttons */
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 20px;  /* Bo tròn cho buttons */
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  margin-right: 5px;
  margin-top: 5px;
}

.buttons button:hover {
  background: #5a6268;  /* Màu xám tối hơn khi hover */
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

.input-area button:hover {
  background: #0056b3;
}

/* Scrollbar tùy chỉnh (optional) */
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
</style>