import BaseService from "../BaseService";

class InvoiceService extends BaseService {
  constructor() {
    super();
    this.module = "invoices";
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
      url: `${this.baseUrl}?limit=${limit}&offset=${offset ? offset : 0}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&rangFilter=${rangFilter}&search=${searchKey}&languageId=${this.getLanguageId()}&locationId=${locationId ? locationId : 0}&type=${type}`,  
      data: this.data,
      headers: this.header
    });
  }

  summary(filter){
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/v1/summary?filter=${filter}`,
      headers: this.header
    });
  }

  checkAvialableInvoiceNo(number) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/check-available/${number}`,
      headers: this.header
    });
  }

  detail(id, includeCredit) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/${id}?includeCredit=${includeCredit ? includeCredit : ""}`,
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

  searchInvoice(invoiceNumber) {
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

  receivedPayment(id, data) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/receve_payment/${id}`,
      data,
      headers: this.header
    });
  }

  makAsSent(id) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/make_as_sent/${id}`,
      headers: this.header
    });
  }

  editShipping(id, shippingDetail, shippingAddress, shippingContact1, shippingContact2, shippingStatus) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/edit_shipping/${id}?shippingDetail=${shippingDetail}&shippingAddress=${shippingAddress}&shippingContact1=${shippingContact1}&shippingContact2=${shippingContact2}&shippingStatus=${shippingStatus}`,
      headers: this.header
    });
  }

  makAsReturn(id) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/mark_as_return/${id}`,
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

export default new InvoiceService();