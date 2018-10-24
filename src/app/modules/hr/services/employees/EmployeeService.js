import BaseService from "../BaseService";

class EmployeeService extends BaseService {

  constructor() {
    super();
    this.module = "employee";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new EmployeeService();