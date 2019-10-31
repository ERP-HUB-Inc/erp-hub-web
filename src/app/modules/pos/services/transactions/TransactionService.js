import BaseService from "../BaseService";

class TransactionService extends BaseService {
  constructor() {
    super();
    this.module = "pos/transaction";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  todaySaleSummary(lastOpenSaleRegisterDate) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/today/summary?lastOpenSaleRegisterDate=${lastOpenSaleRegisterDate}`,  
      data: this.data,
      headers: this.header
    });
  }

  returnTransaction(referenceId, data){
    return this.PUT({
      url: `${this.baseUrl}/return/${referenceId}`,
      data,
      headers: this.header
    });
  }

  sendMailReceipt(template, email) {
    this.setHeader();
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