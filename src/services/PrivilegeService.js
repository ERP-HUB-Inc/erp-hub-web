import BaseService from "../BaseService";

class PrivilegeService extends BaseService {

  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/privilege`;
  }

  checkPermission(module, code) {
      this.setHeader();
      return this.GET(
          {
              url: `${this.baseUrl}/check/permission?module=${module}&privilege=${code}`,
              data: {},
              headers: this.header
          }
      );
  }
}

export default new PrivilegeService();