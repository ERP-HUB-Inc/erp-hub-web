import BaseService from "./BaseService";

class UserService extends BaseService {
  lists() {
    return this.GET({ 
	      url: `${this.baseUrl}/user/v1/lists`,
	      method: "GET",
	      data: {},
	      headers: {
	        "Content-Type": "application/json"
	      }
	    });
  }
}

export default new UserService();