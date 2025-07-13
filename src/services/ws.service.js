// import { ref } from 'vue';

export default class WebSocketService {
  constructor(url) {
    this.ws = null;
    this.url = url || 'ws://localhost:3000';
    this.messageCallbacks = new Set(); // Lưu trữ các callback để xử lý tin nhắn
    this.isConnected = false; // Trạng thái kết nối
  }

  // Khởi tạo kết nối WebSocket
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket đã được kết nối!');
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket đã kết nối!');
      this.isConnected = true;
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Gọi tất cả callback đã đăng ký
      this.messageCallbacks.forEach((callback) => callback(message));
    };

    this.ws.onerror = (error) => {
      console.error('Lỗi WebSocket:', error);
      this.isConnected = false;
    };

    this.ws.onclose = () => {
      console.log('WebSocket đã đóng!');
      this.isConnected = false;
      // Thử kết nối lại sau 5 giây
      setTimeout(() => this.connect(), 5000);
    };
  }

  // Đăng ký callback để xử lý tin nhắn
  onMessage(callback) {
    this.messageCallbacks.add(callback);
  }

  // Hủy đăng ký callback
  offMessage(callback) {
    this.messageCallbacks.delete(callback);
  }

  // Gửi tin nhắn
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket chưa kết nối!');
    }
  }

  // Đóng kết nối
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  // Trả về trạng thái kết nối
  getConnectionStatus() {
    return this.isConnected;
  }
}