import BaseService from "./BaseService";

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
        url: `${this.baseUrl}/find/user-name/${userName}`,
        data: {},
        headers: this.header
      }
    );
  }
}

export default new UserService();