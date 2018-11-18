import BaseService from "../BaseService";

class InventoryService extends BaseService {
<<<<<<< HEAD

=======
>>>>>>> 67770773d10d46f671e7f976c58f6f46460803b1
  constructor() {
    super();
    this.module = "inventory/purchase";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new InventoryService();