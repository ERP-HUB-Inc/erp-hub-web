import BaseService from "./BaseService";

class EmailService extends BaseService {
  constructor() {
    super();
    this.module = "email";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
	
  send(content, email, subJect) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    this.header["email"] = email;
    return this.POST({
      url: `${this.baseUrl}/send`,
      data: {
        content,
        subJect
      },
      headers: this.header
    });
  }
}

export default new EmailService();