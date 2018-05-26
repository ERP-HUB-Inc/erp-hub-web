import BaseService from "../BaseService";

class UserService extends BaseService {
	constructor() {
		super();
	}

	logIn() {
		return this.fetchData({ 
	      url: `${this.baseUrl}/auth/v1/login`,
	      method: "POST",
	      data: {},
	      headers: {
	        userName: "phanna",
	        password: "123456"
	      }
	    });
	}

	lists() {
		const obj = new UserService();
		return this.fetchData({ 
	      url: `${this.baseUrl}/user/v1/lists`,
	      method: "GET",
	      data: {},
	      headers: {
	        "Content-Type": "application/json"
	      }
	    });
	}

	list() {
		return "User Record";
	}
}

export default new UserService();