import BaseService from "../../pos/services/BaseService";

class PrivilegeService extends BaseService {
  constructor() {
    super();
    this.module = "privilege";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
	
  checkPermission(code) {
    this.setHeader();
    return this.GET(
      {
        url: `${this.baseUrl}/check/permission?code=${code}`,
        data: {},
        headers: this.header
      }
    );
  }
}

export default new PrivilegeService();