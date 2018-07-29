import BaseService from "./BaseService";

class AuthService extends BaseService {
  constructor() {
    super();
    this.module = "auth";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  checkAuthenticated(accessToken) {
    return this.fetchData(
      {
        url: `${this.baseUrl}/check/authenticated`,
        data: {},
        headers: {
          "accessToken": accessToken
        }
      }
    );
  }
}
  
export default new AuthService();