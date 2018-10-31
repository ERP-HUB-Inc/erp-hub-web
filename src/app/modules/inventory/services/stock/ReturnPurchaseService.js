import BaseService from "../BaseService";

class ReturnPurchaseService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/purchase/return";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  detail(id){
    const languageId = this.getLanguageId();
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.GET({ 
      url: `${this.baseUrl}/detail/${id}?languageId=${languageId}`,
      data: this.data,
      headers: this.header
    });
  }
}

export default new ReturnPurchaseService();