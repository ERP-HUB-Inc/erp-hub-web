import BaseService from "./BaseService";

class EmailService extends BaseService {
  constructor() {
    super();
    this.module = "email";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
	
  send(content, email, subJect) {
    let from = process.env.REACT_APP_SEND_FROM_LABEL;
    let fromEmail = process.env.REACT_APP_SEND_FROM_EMAIL;
    const currentSetting = this.Util.getSetting();
    if (currentSetting) {
      from = currentSetting.businessName;
      fromEmail = currentSetting.email;
    }
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    this.header["email"] = email;
    return this.POST({
      url: `${this.baseUrl}/send`,
      data: {
        content,
        subJect,
        from,
        fromEmail
      },
      headers: this.header
    });
  }
}

export default new EmailService();