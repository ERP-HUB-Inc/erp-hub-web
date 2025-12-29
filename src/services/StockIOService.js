import BaseService from "./BaseService";

class StockIOService extends BaseService {
  constructor() {
    super();
    this.resource = "stock-io";
    this.baseUrl = `${this.baseUrl}/${this.resource}`;
    this.initializeRoute();
  }

  /**
   * Perform stock-in Transaction.
   * @param {Object} payload - Stock-in details
   * @returns {Promise<Object>}
   */
  getStockInById(id) {
    try {
      return this.GET({
        url: `${this.baseUrl}/${id}`
      });
    } catch (error) {
      this.handleError(error, "stockIn");
    }
  }

  /**
   * Perform stock-in Transaction.
   * @param {Object} payload - Stock-in details
   * @returns {Promise<Object>}
   */
  stockIn(payload = {}) {
    try {
      return this.POST({
        url: `${this.baseUrl}/in`,
        data: payload,
        headers: this.header
      });
    } catch (error) {
      this.handleError(error, "stockIn");
    }
  }

  /**
   * Perform stock-out transaction.
   * @param {Object} payload - Stock-out details
   * @returns {Promise<Object>}
   */
  stockOut(payload = {}) {
    try {
      return this.POST({
        url: `${this.baseUrl}/out`,
        data: payload,
        headers: this.header
      });
    } catch (error) {
      this.handleError(error, "stockOut");
    }
  }

  /**
   * Update stock-out record by ID.
   * @param {string|number} id - Stock-out record ID
   * @param {Object} payload - Updated data
   * @returns {Promise<Object>}
   */
  updateStockOutById(id, payload = {}) {
    if (!id) throw new Error("Missing ID for updateStockOutById()");
    try {
      return this.PUT({
        url: `${this.baseUrl}/out/${id}`,
        data: payload,
        headers: this.header
      });
    } catch (error) {
      this.handleError(error, "updateStockOutById");
    }
  }

  /**
   * Update stock-in record by ID.
   * @param {string|number} id - Stock-in record ID
   * @param {Object} payload - Updated data
   * @returns {Promise<Object>}
   */
  updateStockInById(id, payload = {}) {
    if (!id) throw new Error("Missing ID for updateStockInById()");
    try {
      return this.PUT({
        url: `${this.baseUrl}/in/${id}`,
        data: payload,
        headers: this.header
      });
    } catch (error) {
      this.handleError(error, "updateStockInById");
    }
  }

  /**
   * Unified error handler for consistent error formatting.
   * @param {Error} error
   * @param {string} methodName
   */
  handleError(error, methodName) {
    console.error(`[StockIOService::${methodName}]`, error);
    throw new Error(`StockIOService error in ${methodName}: ${error.message || error}`);
  }
}

export default new StockIOService();