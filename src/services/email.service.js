import createApiClient from "./api.service";

class EmailService {
    constructor(baseUrl = "/api/email") {
        this.api = createApiClient(baseUrl);
    }

    async sendEmail(to, subject, text) {
        const emailData = { to, subject, text };
        return (await this.api.post("/send", emailData)).data;
    }
}

export default new EmailService();
