import BaseService from "../BaseService";

class ApproveTransferService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/stock/approve";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new ApproveTransferService();