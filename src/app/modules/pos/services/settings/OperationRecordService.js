import BaseService from "../BaseService";

class OperationRecordService extends BaseService {

  constructor() {
    super();
    this.module = "income/expense";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new OperationRecordService();