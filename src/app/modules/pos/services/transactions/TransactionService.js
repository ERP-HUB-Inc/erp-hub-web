import BaseService from "../BaseService";

class TransactionService extends BaseService {

  constructor() {
    super();
    this.module = "pos/transaction";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new TransactionService();