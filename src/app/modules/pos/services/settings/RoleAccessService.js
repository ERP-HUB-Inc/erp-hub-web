import BaseService from "../BaseService";

class RoleAccessService extends BaseService {

  constructor() {
    super();
    this.module = "role-access";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new RoleAccessService();