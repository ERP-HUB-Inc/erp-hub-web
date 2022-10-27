import BaseService from "../BaseService";

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

    checkPermissionV2(module, code) {
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