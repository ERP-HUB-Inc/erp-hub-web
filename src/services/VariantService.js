import BaseService from "./BaseService";

class VariantService extends BaseService {

  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/variants`;
    this.initializeRoute();
  }

  fetchByAttributeValue(attributeValue){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/attribitevalue/${attributeValue}`,
      data: this.data,
      headers: this.header
    });
  }

  fetchByBarcode(barcode) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/productvariant/${barcode}`,
      data: this.data,
      headers: this.header
    });
  }

  getDetailWithLocation(id, locationId) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/detail-with-location/${id}?locationId=${locationId}`,
      headers: this.header
    });
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

export default new VariantService(); 