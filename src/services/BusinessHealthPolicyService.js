import BaseService from './BaseService';

export class BusinessHealthPolicyService extends BaseService {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl || `${this.baseUrl}/business-health-policies`;
  }

  get() {
    this.setHeader();
    return this.GET({ url: this.baseUrl, headers: this.header });
  }

  add({ healthyCoveragePercent, criticalBelowCoveragePercent }) {
    this.setHeader();
    return this.POST({ url: this.baseUrl, headers: this.header, data: { healthyCoveragePercent, criticalBelowCoveragePercent } });
  }

  update({ healthyCoveragePercent, criticalBelowCoveragePercent, expectedVersion }) {
    this.setHeader();
    return this.PUT({ url: this.baseUrl, headers: this.header, data: { healthyCoveragePercent, criticalBelowCoveragePercent, expectedVersion } });
  }

  disable(expectedVersion) {
    this.setHeader();
    return this.DELETE({ url: this.baseUrl, headers: this.header, params: { expectedVersion } });
  }
}

export default new BusinessHealthPolicyService();
