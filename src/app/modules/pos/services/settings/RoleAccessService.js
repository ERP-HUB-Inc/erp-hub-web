import BaseService from "../BaseService";

class RoleAccessService extends BaseService {

  constructor() {
    super();
    this.module = "role";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  assignPrivilege(
    roleId,
    data
  ){
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN)}`;
    return this.PUT({ 
      url: `${this.baseUrl}/privilege/grant/${roleId}`,
      data,
      headers: this.header
    });
  }

}

export default new RoleAccessService();