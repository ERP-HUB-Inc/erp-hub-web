import BaseService from "../app/modules/common/services/BaseService";

class HealthService extends BaseService {
  getStatus({ signal, timeout = 5000 } = {}) {
    return this.GET({
      url: `${this.baseUrl}/health`,
      headers: { Accept: "application/json" },
      timeout,
      signal
    });
  }

  // A public health probe must not refresh or change the user's auth session.
  isAuthRefreshAllowed() {
    return false;
  }
}

export default new HealthService();
