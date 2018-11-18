import BaseService from "../BaseService";

class InventoryService extends BaseService {
  constructor() {
    super();
    this.module = "inventory/purchase";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new InventoryService();