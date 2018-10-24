import BaseService from "../BaseService";

class GroupCustomerService extends BaseService {

  constructor() {
    super();
    this.module = "group/customer";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new GroupCustomerService();