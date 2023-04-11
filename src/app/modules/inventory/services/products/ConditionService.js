import BaseService from "../BaseService";

class ConditionService extends BaseService {

  constructor() {
    super();
    this.module = "product/condition";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new ConditionService();