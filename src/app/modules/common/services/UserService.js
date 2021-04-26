import BaseService from "../../pos/services/BaseService";

class UserService extends BaseService {
  constructor() {
    super();
    this.module = "user";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
	
  findUserByUserName(userName) {
    this.setHeader();
    return this.GET(
      {
        url: `${this.baseUrl}/find/username/${userName}`,
        data: {},
        headers: this.header
      }
    );
  }
}

export default new UserService();