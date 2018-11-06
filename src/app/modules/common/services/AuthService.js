import BaseService from "./BaseService";

class AuthService extends BaseService {
  constructor() {
    super();
    this.module = "auth";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  checkAuthenticated(accessToken) {
    return this.POST(
      {
        url: `${this.baseUrl}/check/authenticated`,
        data: {},
        headers: {
          "accessToken": accessToken,
          "deviceNumber": localStorage.getItem(this.ConstantAuth.ACCESS_DEVICE)
        }
      }
    );
  }
}
  
export default new AuthService();