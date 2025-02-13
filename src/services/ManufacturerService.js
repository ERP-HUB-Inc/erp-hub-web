import BaseService from "./BaseService";

class ManufacturerService extends BaseService {

  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/manufacturers`;
  }
}

export default new ManufacturerService();