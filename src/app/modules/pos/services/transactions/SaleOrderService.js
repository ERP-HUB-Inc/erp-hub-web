import BaseService from "../BaseService";

class SaleOrderService extends BaseService {
  constructor() {
    super();
    this.module = "sales_order";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
    this.initializeRoute();
  }

  lists(
    limit,
    offset,
    sortField,
    sortOrder,
    filter, // {"column1": [value1, value2], "column2": [value1, value2]}
    searchKey, // {"column": ["columnname1", "columnname2"], "value": "hello"}
    rangFilter,// {"column": "createdAtt", "value": [1, 100]}
    locationId,
    type // some api use this argument some not use, but no problem wether we use it or not
  ) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&rangFilter=${rangFilter}&search=${searchKey}&languageId=${this.getLanguageId()}&locationId=${locationId}&type=${type}`,  
      data: this.data,
      headers: this.header
    });
  }

  summary() {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/v1/summary`,
      headers: this.header
    });
  }

  checkAvailableNo(number) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/check_available/${number}`,
      headers: this.header
    });
  }

  detail(id) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/${id}`,
      headers: this.header
    });
  }

  detailPublic(id, token) {
    this.header["Authorization"] = `Bearer ${token}`;
    return this.GET({
      url: `${this.baseUrl}/${id}`,
      headers: this.header
    });
  }

  searchSaleOrder(invoiceNumber) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/search/${invoiceNumber}`,
      headers: this.header
    });
  }

  create(data) {
    this.setHeader();
    return this.POST({
      url: this.baseUrl,
      data,
      headers: this.header
    });
  }

  update(data, id) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/${id}`,
      data,
      headers: this.header
    });
  }

  markAsConfirm(id) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/mark_confirm/${id}`,
      headers: this.header
    });
  }

  void(id) {
    this.setHeader();
    return this.DELETE({
      url: `${this.baseUrl}/void/${id}`,
      headers: this.header
    });
  }

  delete(id) {
    this.setHeader();
    return this.DELETE({
      url: `${this.baseUrl}/${id}`,
      headers: this.header
    });
  }
}

export default new SaleOrderService();