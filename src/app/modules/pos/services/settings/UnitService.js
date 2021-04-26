import BaseService from "../BaseService";

class UnitService extends BaseService {
  constructor() {
    super();
    this.module = "unit";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

}

export default new UnitService();