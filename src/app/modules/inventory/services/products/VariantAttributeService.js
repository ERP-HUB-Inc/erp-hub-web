import BaseService from "../BaseService";

class VariantAttributeService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/attribute";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new VariantAttributeService();