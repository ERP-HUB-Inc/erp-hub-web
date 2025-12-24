import BaseService from "./BaseService";

class PurchaseOrderService extends BaseService {

   constructor() {
     super();
     this.baseUrl = `${this.baseUrl}/purchase-orders`;
     this.initializeRoute();
   }

   /**
   * Get Purchase Order by ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async getPurchaseOrderById(id) {
    try {
      return await this.GET({
        url: `${this.baseUrl}/${id}`
      });
    } catch (error) {
      this.handleError(error, "getPurchaseOrderById");
    }
  }

  /**
   * Create a Purchase Order
   * @param {Object} payload - Purchase order create data
   * @returns {Promise<Object>}
   */
  async createPurchaseOrder(payload = {}) {
    try {
      return await this.POST({
        url: `${this.baseUrl}`,
        data: payload,
        headers: this.header
      });
    } catch (error) {
      this.handleError(error, "createPurchaseOrder");
    }
  }

  /**
   * Update a Purchase Order by ID
   * @param {string|number} id - PO ID
   * @param {Object} payload - Updated PO data
   * @returns {Promise<Object>}
   */
  async updatePurchaseOrder(id, payload = {}) {
    if (!id) throw new Error("Missing ID for updatePurchaseOrder()");
    try {
      return await this.PUT({
        url: `${this.baseUrl}/${id}`,
        data: payload,
        headers: this.header
      });
    } catch (error) {
      this.handleError(error, "updatePurchaseOrder");
    }
  }

  /**
   * Optional: Delete a Purchase Order
   */
  async deletePurchaseOrder(id) {
    if (!id) throw new Error("Missing ID for deletePurchaseOrder()");
    try {
      return await this.DELETE({
        url: `${this.baseUrl}/${id}`,
        headers: this.header
      });
    } catch (error) {
      this.handleError(error, "deletePurchaseOrder");
    }
  }

  /**
   * Unified error handler for consistent error formatting.
   * @param {Error} error
   * @param {string} methodName
   */
  handleError(error, methodName) {
    console.error(`[PurchaseOrderService::${methodName}]`, error);
    throw new Error(`PurchaseOrderService error in ${methodName}: ${error.message || error}`);
  }
}

export default new PurchaseOrderService();