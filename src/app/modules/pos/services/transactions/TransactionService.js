import BaseService from "../BaseService";

class TransactionService extends BaseService {
  constructor() {
    super();
    this.module = "pos/transaction";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  sendMailReceipt(template, email) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    this.header["email"] = email;
    return this.POST({
      url: `${this.baseUrl}/send/mail/receipt`,
      data: {
        content: template
      },
      headers: this.header
    });
  }
}

export default new TransactionService();