import BaseService from "../BaseService";

class PurchaseOrderService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/purchase";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  detail(
    ids,
    languageId = "en"
  ){
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN)}`;
    return this.GET({ 
      url: `${this.baseUrl}/detail/${ids}?languageId=${languageId}`,
      data: this.data,
      headers: this.header
    });
  }
}

export default new PurchaseOrderService();