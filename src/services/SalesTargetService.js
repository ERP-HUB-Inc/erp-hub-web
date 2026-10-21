import BaseService from "../app/modules/common/services/BaseService";

class SalesTargetService extends BaseService {
  list(options) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/sales-targets?${new URLSearchParams(options).toString()}`,
      headers: this.header,
    });
  }
  save(target, id) {
    this.setHeader();
    const option = {
      url: `${this.baseUrl}/sales-targets${id ? `/${encodeURIComponent(id)}` : ""}`,
      data: target,
      headers: this.header,
    };
    return id ? this.PUT(option) : this.POST(option);
  }
}
export default new SalesTargetService();
