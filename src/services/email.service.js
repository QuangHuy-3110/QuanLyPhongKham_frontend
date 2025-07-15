import createApiClient from "./api.service";

class EmailService {
    constructor(baseUrl = "/api/email") {
        this.api = createApiClient(baseUrl);
    }

    // email.service.js (client)
    async sendEmail(to, content) {
        try {
            const emailData = {
            to,
            subject: content.subject,
            text: content.text,
            html: content.html,
            };
            const response = await this.api.post("/send", emailData);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gửi email:", error);
            throw error;
        }
    }
}

export default new EmailService();
