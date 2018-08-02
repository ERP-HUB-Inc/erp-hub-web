import BaseService from "../BaseService";

class UnitService extends BaseService {

  constructor() {
    super();
    this.module = "client";
    // this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}/detail/00000001-0001-2018-0001-00000001`;
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new UnitService();