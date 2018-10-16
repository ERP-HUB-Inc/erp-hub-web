import BaseService from "../BaseService";

class RolePrivilegeService extends BaseService {

  constructor() {
    super();
    this.module = "role/privilege";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  lists(
    id
  ){
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.GET({ 
      url: `${this.baseUrl}/lists/${id}`,
      data: this.data,
      headers: this.header
    });
  }
}

export default new RolePrivilegeService();