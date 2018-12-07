import BaseService from "../BaseService";

class ProductVariantService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/product/variant";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  checkIsAvailableForArchive(id){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/check/status?id=${id}`,
      data: this.data,
      headers: this.header
    });
  }

  checkIsAvailableArchiveAttributeValue(id){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/attributevalue/check/status?attributeValueId=${id}`,
      data: this.data,
      headers: this.header
    });
  }

  checkIsAvailableArchiveAttribute(id){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/attribute/check/status?attributeId=${id}`,
      data: this.data,
      headers: this.header
    });
  }
}

export default new ProductVariantService(); 