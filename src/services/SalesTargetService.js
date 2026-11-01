import BaseService from "./BaseService";

export class SalesTargetService extends BaseService {
  list({ locationId, targetType, year, status, limit = 20, offset = 0 } = {}) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/sales-targets`,
      params: { locationId, targetType, year, status, limit, offset },
      headers: this.header,
    });
  }
  save(target, id) {
    this.setHeader();
    const option = {
      url: `${this.baseUrl}/sales-targets${id != null ? `/${encodeURIComponent(id)}` : ""}`,
      data: {
        locationId: target.locationId, targetType: target.targetType, year: target.year,
        month: target.month, quarter: target.quarter, targetRevenue: target.targetRevenue, status: target.status
      },
      headers: this.header,
    };
    return id != null ? this.PUT(option) : this.POST(option);
  }

  getById(id) {
    this.setHeader();
    return this.GET({ url: `${this.baseUrl}/sales-targets/${encodeURIComponent(id)}`, headers: this.header });
  }

  disable(ids) {
    this.setHeader();
    return this.DELETE({ url: `${this.baseUrl}/sales-targets/${ids.map(id => encodeURIComponent(id)).join(',')}`, headers: this.header });
  }
}
export default new SalesTargetService();
