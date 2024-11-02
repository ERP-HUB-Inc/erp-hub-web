import BaseService from "./BaseService";

class OptionService extends BaseService {

  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/options`;
  }
}

export default new OptionService();