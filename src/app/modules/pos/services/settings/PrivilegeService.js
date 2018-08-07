import BaseService from "../BaseService";

class PrivilegeService extends BaseService {

  constructor() {
    super();
    this.module = "privilege";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new PrivilegeService();