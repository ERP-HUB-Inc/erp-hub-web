import BaseService from "./BaseService";

class AuthService extends BaseService {
  constructor() {
    super();
    this.module = "auth";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
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

  logout() {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.POST(
      {
        url: `${this.baseUrl}/logout`,
        data: {},
        headers: this.header
      }
    );
  }
}
  
export default new AuthService();