import BaseService from "./BaseService";

class StockIOService extends BaseService {
  constructor() {
    super();
    this.resource = "stock-io";
    this.baseUrl = `${this.baseUrl}/${this.resource}`;
    this.initializeRoute();
  }

  /**
   * Perform stock-in transaction.
   * @param {Object} payload - Stock-in details
   * @returns {Promise<Object>}
   */
  async stockIn(payload = {}) {
    this.setHeader();
    try {
      return await this.POST({
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
  async stockOut(payload = {}) {
    this.setHeader();
    try {
      return await this.POST({
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
  async updateStockOutById(id, payload = {}) {
    if (!id) throw new Error("Missing ID for updateStockOutById()");
    this.setHeader();
    try {
      return await this.PUT({
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
  async updateStockInById(id, payload = {}) {
    if (!id) throw new Error("Missing ID for updateStockInById()");
    this.setHeader();
    try {
      return await this.PUT({
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